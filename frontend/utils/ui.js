const $workoutNameInputBox = document.querySelector("#workout-name")
const $workoutList = document.querySelector("#workout-list")
const $workoutInputForm = document.querySelector(".workout-input-form")

/**
 * Gets all values assosciated with adding workout
 * @returns {object} - A dictionary containing values of the form representing a complete object
 */
const getAddWorkoutFormValues = () => ({
  name: $workoutNameInputBox.value,
})

/**
 * Clears the input boxes
 */
const clearAddWorkoutForm = () => {
  $workoutNameInputBox.value = ""
}

/**
 * Show workout input form
 *
 * @param {string} formAction - Action about adding or updating the form - save or edit
 * @param {string} formHeaderText - Heading for the input form
 * @param {object} workout - An object representing workout containing keys: name
 */
const showWorkoutInputForm = async (
  formAction = "save",
  formHeadingText = "Add a workout",
  workoutId
) => {
  $workoutInputForm.querySelector("h2").textContent = formHeadingText
  $workoutInputForm.classList.remove("hidden")
  const $addButton = $workoutInputForm.querySelector(".form-add-button")
  const $editButton = $workoutInputForm.querySelector(".form-edit-button")

  if (formAction === "save") {
    $addButton.classList.remove("hidden")
    $editButton.classList.add("hidden")
    $workoutNameInputBox.value = ""
  } else if (formAction === "edit") {
    const workout = await getWorkoutByIdFromDb(workoutId)
    $addButton.classList.add("hidden")
    $editButton.classList.remove("hidden")
    $workoutNameInputBox.value = workout.name
  } else {
    throw new Error(
      "Given form action is invalid! Please use either 'Save' or 'Update'"
    )
  }
}
/**
 * Hide workout input form
 *
 */
const hideWorkoutInputForm = () => {
  $workoutInputForm.classList.add("hidden")
}

/**
 * Creates a DOM elemnt for given workout
 *
 * @param {object} workout An object representing a workout fully formed object with _id
 * @returns {HTMLElement} - A DOM element representing a workout
 */
const createWorkoutElement = (workout) =>
  `<li data-workout_id=${workout._id}>
    <p>${workout.name}</p>
    <button type="button" onclick="deleteWorkoutHandler('${workout._id}')">Delete</button>
    <button type="button" onclick="editWorkoutHandler('${workout._id}')">Edit</button>
  </li>`

/**
 * Find the workout element based on ID
 *
 * @param {string} workoutId A unique ID to identify workout
 * @returns {HTMLElement} - A DOM element representing a workout if it exists, else undefined
 */
const getWorkotutElementByID = (workoutId) =>
  $workoutList.querySelector(`li[data-workout_id="${workoutId}"]`)

/**
 * Adds workout to the workout list
 *
 * @param {object} workout - An object representing newly added workout containing keys: name
 */
function addWorkoutToList(workout) {
  $workoutList.insertAdjacentHTML("afterbegin", createWorkoutElement(workout))
}

/**
 * Delete wokrout from the list based on ID
 *
 * @param {string} wokroutId - A unique id associated with each workout object to delete
 *
 * @returns {HTMLElement | undefined} - The deleted workout element if it exists, otherwise `undefined`
 */
function deleteWorkoutFromList(workoutId) {
  const workoutItem = getWorkotutElementByID(workoutId)
  // If the element exists, remove it
  if (workoutItem) {
    workoutItem.remove()
    return workoutItem
  } else {
    console.warn(`Workout with ID ${workoutId} not found in the list.`)
  }
}

/**
 * Replace workout element from the list based on ID
 *
 * @param {string} workoutId - A unique id associated with each workout object to replace
 * @param {object} newWorkout - An object representing the updated workout
 *
 * @returns {HTMLElement | undefined} - The replaced workout element if it exists, otherwise `undefined`
 */
function replaceWorkoutInList(workoutId, newWorkout) {
  const workoutItem = getWorkotutElementByID(workoutId)
  if (workoutItem) {
    const newWorkoutElement = createWorkoutElement(newWorkout)
    workoutItem.outerHTML = newWorkoutElement
    return workoutItem
  } else {
    console.warn(`Workout with ID ${workoutId} not found in the list.`)
  }
}

// ------------------------------

const uIUnitTest = async () => {
  // ADD WORKOUT TEST
  const workout = {
    _id: "6783f0c2ba93c98532cc4e24",
    name: "Crunches",
    createdAt: "2025-01-12T16:41:38.886Z",
    updatedAt: "2025-01-12T17:15:04.475Z",
    __v: 0,
  }
  const workout2 = {
    _id: "6783f0c2ba93c98532cc4e24123",
    name: "Negative push ups",
    createdAt: "2025-01-12T16:41:38.886Z",
    updatedAt: "2025-01-12T17:15:04.475Z",
    __v: 0,
  }
  addWorkoutToList(workout)
  console.log(deleteWorkoutFromList(workout._id))

  addWorkoutToList(workout)
  console.log(replaceWorkoutInList(workout._id, workout2))

  hideWorkoutInputForm()
  showWorkoutInputForm("Edit a workout")
  showWorkoutInputForm()
  showWorkoutInputForm("Edit a workout", workout)
}

//uIUnitTest()
