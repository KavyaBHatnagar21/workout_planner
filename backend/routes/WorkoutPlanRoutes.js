const express = require('express');
const router = express.Router();
const { getWorkoutPlans, getWorkoutPlanByDay, updateWorkoutPlanByDay } = require('../controllers/WorkoutPlanController');

router.get('/', getWorkoutPlans);
router.get('/:day', getWorkoutPlanByDay);
router.patch('/:day', updateWorkoutPlanByDay);

module.exports = router;