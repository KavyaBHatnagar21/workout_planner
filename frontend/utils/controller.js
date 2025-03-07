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
  const workoutFormValue = getWorkoutFormValues()
  const workout = await addWorkoutToDb(workoutFormValue)
  addWorkoutToList(workout)
  clearWorkoutForm()
  hideWorkoutInputForm()
}

/**
 * Handles updation of the workout acquired from clicking the update button present on the update workout form
 */
const updateWorkoutFormHandler = async (event) => {
  event.preventDefault()
  const workoutId = event.target.getAttribute("data-workout-id")
  const workoutFormValue = getWorkoutFormValues()
  const newWorkout = await updateWorkoutInDb(workoutId, workoutFormValue)
  replaceWorkoutInList(workoutId, newWorkout)
  clearWorkoutForm()
  hideWorkoutInputForm()
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
  showWorkoutInputForm("edit", workoutId)
}

const contollerUnitTest = () => {
  workoutListLoader()
}

contollerUnitTest()
