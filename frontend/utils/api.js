const API_BASE_URL = "http://localhost:3000"

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
    if (!response.ok) throw new Error(`Error! Status: ${response.status}`)
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

async function ApiUnitTest() {
  // GET STATUS
  console.log(await getApiStatus())

  // ADD WORKOUT TO DB
  console.log(await addWorkoutToDb({ name: "cycling" }))
  console.log(
    await addWorkoutToDb({ name: "cycling", description: "good for cardio" })
  )

  // GET ALL WORKOUTS
  ;(await getAllWorkoutFromDb()).forEach((workout) => {
    console.log(workout)
  })

  // GET WORKOUT BY ID
  let workout = (await getAllWorkoutFromDb())[0]
  console.log(await getWorkoutByIdFromDb(workout._id))

  // UPDATE TEST
  workout = (await getAllWorkoutFromDb())[0]
  console.log(workout)
  console.log(await updateWorkoutInDb(workout._id, { name: "Kavya" }))

  // DELETE TEST
  const workoutToDelete = (await getAllWorkoutFromDb())[0]
  console.log(workoutToDelete)
  console.log(await deleteWorkoutInDb(workoutToDelete._id))
  console.log(await getWorkoutByIdFromDb(workoutToDelete._id))
}

//ApiUnitTest()
