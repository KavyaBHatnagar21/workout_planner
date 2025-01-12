const express = require('express');
const router = express.Router();
const { addWorkout, getWorkouts, getWorkoutById, editWorkoutById, deleteWorkoutById } = require('../controllers/workoutController');

router.post('/', addWorkout);
router.get('/', getWorkouts);
router.get('/:id', getWorkoutById);
router.put('/:id', editWorkoutById);
router.delete('/:id', deleteWorkoutById);

module.exports = router;