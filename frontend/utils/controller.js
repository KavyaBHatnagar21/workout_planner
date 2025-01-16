/**
 * Loads all the workouts in the UI
 */
const workoutListLoader = async () => {
  const workouts = await getAllWorkoutFromDb()
  workouts.forEach((workout) => {
    addWorkoutToList(workout)
  })
}

/**
 * Handles add workout event by updating UI and DB
 */
const addWorkoutHandler = async (e) => {
  e.preventDefault()
  const workoutFormValue = getAddWorkoutFormValues()
  const workout = await addWorkoutToDb(workoutFormValue)
  addWorkoutToList(workout)
  clearAddWorkoutForm()
}

/**
 * Handles delete workout by removing workout from UI and DB
 */
const deleteWorkoutHandler = async (workoutId) => {
  const deleteApiRes = await deleteWorkoutInDb(workoutId)
  if (
    deleteApiRes.message &&
    deleteApiRes.message === "Workout deleted successfully"
  ) {
    const deletedWorkout = deleteWorkoutFromList(workoutId)
    if (deletedWorkout === undefined) {
      throw new Error(`Failed to delete workout with id: ${workoutId} from UI`)
    }
  } else {
    throw new Error(`Failed to delete workout with id: ${workoutId} from DB`)
  }
}

const editWorkoutHandler = async (workoutId) => {
  showWorkoutInputForm("edit", "Edit a workout", workoutId)
}

const contollerUnitTest = () => {
  workoutListLoader()
}

contollerUnitTest()
