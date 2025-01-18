const WorkoutPlan = require("../models/WorkoutPlanModel")

/**
 * Get all the workout plans
 */
const getWorkoutPlans = async (req, res) => {
    try {
        const daysOfWeek = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
        const completePlans = await Promise.all(daysOfWeek.map((day) => WorkoutPlan.getOrCreateWorkoutPlan(day)));
        res.json(completePlans);
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};

/**
 * Get a workout plan by day
 */
const getWorkoutPlanByDay = async (req, res) => {
    try {
        const { day } = req.params;
        const workoutPlan = await WorkoutPlan.getOrCreateWorkoutPlan(day);
        res.json(workoutPlan);
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};

/**
 * Update workout by day
 */
const updateWorkoutPlanByDay = async (req, res) => {
    try {
        const { day } = req.params;
        const { warmup, workouts, cooldown, isBreakDay } = req.body;

        const updatedWarmup = warmup ? await WorkoutPlan.validateAndAttachWorkouts(warmup) : [];
        const updatedWorkouts = workouts ? await WorkoutPlan.validateAndAttachWorkouts(workouts) : [];
        const updatedCooldown = cooldown ? await WorkoutPlan.validateAndAttachWorkouts(cooldown) : [];

        const workoutPlan = await WorkoutPlan.populateWorkoutPlan(
            WorkoutPlan.findOneAndUpdate(
                { day },
                { $set: { warmup: updatedWarmup, workouts: updatedWorkouts, cooldown: updatedCooldown, isBreakDay } },
                { new: true, upsert: true }
            )
        );
        res.json(workoutPlan);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = { getWorkoutPlans, getWorkoutPlanByDay, updateWorkoutPlanByDay };



