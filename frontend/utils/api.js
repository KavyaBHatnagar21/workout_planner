/**
 * A reusable function to make API requests
 *
 * @param {string} endpoint - The API endpoint (realtive to API_BASE_URL)
 * @param {object} [options={}] - Fetch options (e.g., methods, headers, body)
 * @returns {Promise<any>} - A promise that resolves into the response JSON
 */
const apiRequest = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options)
    if (!response.ok)
      throw new Error(`Error (${response.status}) ${response.error}`)
    return await response.json()
  } catch (error) {
    console.error(`Error in API request to ${endpoint}: `, error)
    throw error
  }
}

/**
 * Get status of API
 *
 * @returns {Promise<any>} A promise that resolves into {status: "ok"}
 */
const getApiStatus = () => apiRequest("/api/status")

/**
 * Add workout to DB
 *
 * @param {object} workout - An object representing newly added workout containing keys: name
 * @returns {Promise<any>} A promise that resolves into an object representing the newly added workout containing keys: name, _id, createdAt, updateAt, __v
 */
const addWorkoutToDb = (workout) =>
  apiRequest("/api/workouts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(workout),
  })

/**
 * Get all workouts from DB
 *
 * @returns {Promise<any>} A promise that resolves into an array of objects representing workouts
 */
const getAllWorkoutFromDb = () => apiRequest("/api/workouts")

/**
 * Get wokrout from DB based on ID
 *
 * @param {string} wokroutId - A unique id associated with each workout object
 * @returns {Promise<any>} - A promise that resolves to the fetched workout details
 */
const getWorkoutByIdFromDb = (wokroutId) =>
  apiRequest(`/api/workouts/${wokroutId}`)

/**
 * Update wokrout in DB based on ID
 *
 * @param {string} wokroutId - A unique id associated with each workout object to update
 * @param {object} workout - The data to update (e.g. { name: "Crunches" })
 * @returns {Promise<any>} - A promise that resolves to the complete workout details along with _id and dates
 */
const updateWorkoutInDb = (wokroutId, workout) =>
  apiRequest(`/api/workouts/${wokroutId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(workout),
  })

/**
 * Delete wokrout in DB based on ID
 *
 * @param {string} wokroutId - A unique id associated with each workout object to delete
 * @returns {Promise<any>} - A promise that resolves to {"message": "Workout deleted successfully"}
 */
const deleteWorkoutInDb = (wokroutId) =>
  apiRequest(`/api/workouts/${wokroutId}`, {
    method: "DELETE",
  })

// ------------------------------

/**
 * Get all workout plans from DB
 *
 * @returns {Promise<any>} A promise that resolves into an array of objects representing workout plans
 */
const getAllWorkoutPlansFromDb = () => apiRequest("/api/workout-plans/")

/**
 * Get a workout plan by day
 *
 * @param {string} day - The day of the week in lowercase
 * @returns {Promise<any>} A promise that resolves into an object representing a workout plan
 */
const getWorkoutPlanByDayFromDb = (day) =>
  apiRequest(`/api/workout-plans/${day}`)

/**
 * Update the workout plan with a given plan. Make sure to send all the values that you want to set.
 * Example if you only send warmup and leave workouts and cooldown empty, the workout plan will only have warmup and others will be set to empty.
 *
 * @param {string} day - The day of the week in lowercase
 * @param {object} workoutPlan - The workout plan to update
 * @returns {Promise<any>} A promise that resolves into an object representing the updated workout plan
 */
const updateWorkoutPlanByDay = (day, workoutPlan) =>
  apiRequest(`/api/workout-plans/${day}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(workoutPlan),
  })

// ------------------------------

async function ApiUnitTest() {
  // GET STATUS
  // console.log(await getApiStatus())
  // // ADD WORKOUT TO DB
  // console.log(await addWorkoutToDb({ name: "cycling" }))
  // console.log(
  //   await addWorkoutToDb({ name: "cycling", description: "good for cardio" })
  // )
  // // GET ALL WORKOUTS
  // ;(await getAllWorkoutFromDb()).forEach((workout) => {
  //   console.log(workout)
  // })
  // // GET WORKOUT BY ID
  // let workout = (await getAllWorkoutFromDb())[0]
  // console.log(await getWorkoutByIdFromDb(workout._id))
  // // UPDATE TEST
  // workout = (await getAllWorkoutFromDb())[0]
  // console.log(workout)
  // console.log(await updateWorkoutInDb(workout._id, { name: "Kavya" }))
  // // DELETE TEST
  // const workoutToDelete = (await getAllWorkoutFromDb())[0]
  // console.log(workoutToDelete)
  // console.log(await deleteWorkoutInDb(workoutToDelete._id))
  // console.log(await getWorkoutByIdFromDb(workoutToDelete._id))
  // ------------------------------

  // GET ALL WORKOUT PLANS
  //console.log("kavya", await getAllWorkoutPlansFromDb())

  // GET WORKOUT PLAN BY DAY
  // console.log(await getWorkoutPlanByDayFromDb("monday"))

  // // UPDATE WORKOUT PLAN BY DAY
  // console.log(
  //   await updateWorkoutPlanByDay("tuesday", {
  //     warmup: [],
  //     workouts: [],
  //     cooldown: [],
  //     isBreakDay: true,
  //   })
  // )

  // // UPDATE WORKOUT PLAN BY DAY
  // const allWorkouts = await getAllWorkoutFromDb()
  // console.log(allWorkouts)
  // const workoutIds = allWorkouts.map((workout) => workout._id)
  // console.log(workoutIds)
  // const workoutPlan = {
  //   warmup: [{workout: workoutIds[0], note: "10 repos 3 sets"}, {workout: workoutIds[3]}],
  //   workouts: [{workout: workoutIds[1], note: "10 push ups 3 sets"}, {workout: workoutIds[4]}],
  //   cooldown: [{workout: workoutIds[2], note: "10 squats 3 sets"}, {workout: workoutIds[5]}],
  //   isBreakDay: false,
  // }
  // console.log(workoutPlan)
  // console.log(
  //   "updated plan",
  //   await updateWorkoutPlanByDay("wednesday", workoutPlan)
  // )
}

ApiUnitTest()
