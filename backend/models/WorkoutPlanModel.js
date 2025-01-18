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
    return Promise.all(items.map(async (item) => {
        const workoutExists = await mongoose.model("Workout").findById(item.workout);
        if (!workoutExists) {
            throw new Error(`Workout with ID ${item.workout} does not exist`);
        }
        return {
            workout: workoutExists._id, note: item.note || "",
        };
    }));
};

WorkoutPlanSchema.statics.populateWorkoutPlan = function (query) {
    return query.populate([{path: "warmup.workout", model: "Workout"}, {
        path: "workouts.workout",
        model: "Workout"
    }, {path: "cooldown.workout", model: "Workout"},]);
};


WorkoutPlanSchema.statics.getOrCreateWorkoutPlan = async function (day) {
    let workoutPlan = await this.findOne({day});
    if (!workoutPlan) {
        workoutPlan = new this({day});
        await workoutPlan.save();
    }
    return this.populateWorkoutPlan(this.findOne({day})); // Populate before returning
};

module.exports = mongoose.model('WorkoutPlan', WorkoutPlanSchema);