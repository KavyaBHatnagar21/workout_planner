const Workout = require('../models/workoutModel');
const WorkoutPlan = require('../models/WorkoutPlanModel');

// Create a new workout
const addWorkout = async (req, res) => {
    try {
        const {name} = req.body;

        if (!name) {
            return res.status(400).json({error: 'Workout name is required'});
        }

        const newWorkout = new Workout({name});
        await newWorkout.save();

        res.status(201).json(newWorkout);
    } catch (error) {
        res.status(500).json({error: 'Server error'});
    }
};

// Get all the workouts
const getWorkouts = async (req, res) => {
    try {
        const workouts = await Workout.find().sort({createdAt: -1});
        res.json(workouts);
    } catch (error) {
        res.status(500).json({error: 'Server error'});
    }
};

// Get a workout by id
const getWorkoutById = async (req, res) => {
    try {
        const {id} = req.params;

        const workout = await Workout.findById(id);
        if (!workout) {
            return res.status(404).json({error: 'Workout not found'});
        }

        res.json(workout);
    } catch (error) {
        res.status(500).json({error: 'Server error'});
    }
};
// Edit a workout by id
const editWorkoutById = async (req, res) => {
    try {
        const {id} = req.params;
        const allowedUpdates = ['name'];
        const updates = Object.keys(req.body);

        const isValidUpdate = updates.every(update => allowedUpdates.includes(update));
        if (!isValidUpdate) {
            return res.status(400).json({error: 'Invalid update'});
        }

        const workout = await Workout.findByIdAndUpdate(id, req.body, {new: true});
        if (!workout) {
            return res.status(404).json({error: 'Workout not found'});
        }

        res.json(workout);
    } catch (error) {
        res.status(500).json({error: 'Server error'});
    }
};

// Delete a workout by id
const deleteWorkoutById = async (req, res) => {
    try {
        const {id} = req.params;

        const workout = await Workout.findById(id);
        if (!workout) {
            return res.status(404).json({error: 'Workout not found'});
        }

        await Workout.findByIdAndDelete(id);

        await WorkoutPlan.updateMany({
            $or: [{'warmup.workout': workout._id}, {'workouts.workout': workout._id}, {'cooldown.workout': workout._id}]
        }, {
            $pull: {
                warmup: {workout: workout._id}, workouts: {workout: workout._id}, cooldown: {workout: workout._id}
            }
        });

        res.json({message: 'Workout deleted successfully'});
    } catch (error) {
        res.status(500).json({error: 'Server error'});
    }
}


module.exports = {addWorkout, getWorkouts, getWorkoutById, editWorkoutById, deleteWorkoutById};