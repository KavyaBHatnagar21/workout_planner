const mongoose = require('mongoose');

const WorkoutPlanSchema = new mongoose.Schema({
    day: {
        type: String,
        enum: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"],
        required: true
    }, isBreakDay: {
        type: Boolean, default: false
    }, warmup: [{
        workout: {type: mongoose.Schema.Types.ObjectId, ref: 'Workout'}, note: {type: String, default: ""}
    }], workouts: [{
        workout: {type: mongoose.Schema.Types.ObjectId, ref: 'Workout'}, note: {type: String, default: ""}
    }], cooldown: [{
        workout: {type: mongoose.Schema.Types.ObjectId, ref: 'Workout'}, note: {type: String, default: ""}
    }]
}, {
    timestamps: true
});

WorkoutPlanSchema.statics.validateAndAttachWorkouts = async function (items) {
    const invalidWorkouts = [];
    const validItems = await Promise.all(items.map(async (item) => {
        if(!item.workout) {
            invalidWorkouts.push({workout: item, possibleReasons: ["Workout ID not provided"]});
            return null;
        }

        const workoutExists = await mongoose.model("Workout").findById(item.workout);
        if (!workoutExists) {
            invalidWorkouts.push({workout: item, possibleReasons: ["Workout does not exist"]});
            return null;
        }
        return {
            workout: workoutExists._id, note: item.note || "",
        };
    }));

    if (invalidWorkouts.length > 0) {
        throw new Error(`Invalid workouts: ${JSON.stringify(invalidWorkouts)}`);
    }

    return validItems.filter(item => item !== null);
};

WorkoutPlanSchema.statics.populateWorkoutPlan = function (query) {
    try {
        return query.populate([
            { path: "warmup.workout", model: "Workout" },
            { path: "workouts.workout", model: "Workout" },
            { path: "cooldown.workout", model: "Workout" }
        ]);
    } catch (error) {
        throw new Error(`Error populating workout plan: ${error.message}`);
    }
};


WorkoutPlanSchema.statics.getOrCreateWorkoutPlan = async function (day) {
    try {
        if(typeof day !== "string" || !["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"].includes(day)) {
            throw new Error(`${day} is not a valid day of the week`);
        }

        let workoutPlan = await this.findOne({day});
        if (!workoutPlan) {
            workoutPlan = new this({day});
            await workoutPlan.save();
        }
        return this.populateWorkoutPlan(this.findOne({day})); // Populate before returning
    } catch (error) {
        if (error.name === "CastError") {
            throw new Error(`Error getting or creating a workout plan for ${day}: ${error.message}`);
        }
        throw error;
    }
};

module.exports = mongoose.model('WorkoutPlan', WorkoutPlanSchema);