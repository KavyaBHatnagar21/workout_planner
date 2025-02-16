export const workoutPlannerModel =  {
    workoutPlans: [],

    // Function to fetch the data from backend
    async fetchWorkouts () {
        this.workoutPlans = await getAllWorkoutPlansFromDb()
        console.log("Fetched workout plans:", workoutPlans);
        return this.workoutPlans;
    },

    // Utility to get a plan for a specific day.
    getWorkoutPlan(day) {
        return this.workoutPlans.find(plan => plan.day === day);
    }
}

