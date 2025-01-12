const Workout = require('../models/workoutModel');

// Create a new workout
const addWorkout = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Workout name is required' });
    }

    const newWorkout = new Workout({ name });
    await newWorkout.save();

    res.status(201).json(newWorkout);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { addWorkout };