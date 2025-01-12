const express = require('express');
const router = express.Router();
const { addWorkout } = require('../controllers/workoutController');

router.post('/', addWorkout);

module.exports = router;