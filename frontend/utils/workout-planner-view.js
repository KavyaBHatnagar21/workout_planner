// DOM Elements
/**
 * Used to change and view any workout plan.
 * @type {NodeListOf<Element>}
 */
const weekdayButtons = document.querySelectorAll('.week-button');
/**
 * Used to mark a day as break day or not.
 * @type {Element}
 */
const $breakInput = document.querySelector("#break-input-container input");


// Constants
const WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];


// Data Structure
/**
 * Represents the current selected day in the UI.
 * @type {string}
 */
let selectedDay = '';
/**
 * Workouts planned for each day of the week.
 * @type {*[]}
 */
let workoutPlans = []
/**
 * All the workouts created in the workout manager.
 * @type {*[]}
 */
let workouts = []


// UI Functions

/**
 * Highlights given day in the weekdays button list.
 * @param day The day to highlight e.g. Sunday or monday
 */
const highlightWeekDayButton = (day) => {
    weekdayButtons.forEach(weekdayButton => {
        weekdayButton.classList.toggle("active", weekdayButton.textContent.toLowerCase() === day.toLowerCase());
    })
}


/**
 * Initializes the Workout Planner Screen
 * @returns {Promise<void>}
 */
const initWorkoutPlans = async () => {
    workoutPlans = await getAllWorkoutPlansFromDb()
    workouts = await getAllWorkoutFromDb()
    selectedDay = WEEKDAYS[new Date().getDay()].toLowerCase()
    highlightWeekDayButton(selectedDay)
    displayWorkout(workoutPlans.find((workoutPlan) => workoutPlan.day === selectedDay));
}

/**
 * Toggle the visibility of add workout form. This automatically uses the right day in the right category.
 * @param e
 */
const toggleAddWorkoutForm = (e) => {
    const clickedButton = e.target
    const parentContainer = clickedButton.closest('.category-workouts-container')
    const newWorkoutForm = parentContainer.querySelector('.new-workout')
    newWorkoutForm.classList.toggle('hidden')
}

/**
 * Deletes a workout form the appropriate day and category.
 * @param e
 * @param workoutId
 * @returns {Promise<void>}
 */
const deleteWorkoutHandler = async (e, workoutId) => {
    const parentContainer = e.target.closest('.category-workouts-container')
    const editInformationContainer = e.target.closest(".workout-list-item").querySelector(".workout-edited-details")
    const category = e.target.closest('.category-workouts-container').querySelector('h2').textContent.toLowerCase()

    // Find the workout plan for the current selected day
    const currentDayPlan = workoutPlans.find((workoutPlan) => workoutPlan.day === selectedDay);

    currentDayPlan[category].map((workoutPlan) => {
        console.log(workoutPlan)
    })
    // Filter out the workout from the selected category
    currentDayPlan[category] = currentDayPlan[category].filter(workoutPlan => workoutPlan._id !== workoutId);

    // Save the updated workout plan to the backend
    try {
        await updateWorkoutPlanByDay(selectedDay, currentDayPlan);
        displayWorkout(currentDayPlan); // Re-render the UI
    } catch (error) {
        console.error("Failed to update workout plan:", error);
    }
}

const saveEditWorkout = async (e) => {
    const clickedButton = e.target
    const parentContainer = clickedButton.closest('.category-workouts-container')

    const category = parentContainer.querySelector('h2').textContent.toLowerCase()

    const selectElement = parentContainer.querySelector('select');
    const selectedOption = selectElement.options[selectElement.selectedIndex];
    const workoutId = selectedOption.value; // The _id of the workout
    const workoutName = selectedOption.textContent; // The name of the workout
    let workoutNote = [...parentContainer.querySelectorAll('.workout-note-edit-box')].at(-1).value
    console.log("Workout note:", workoutNote)

    // Create a new workout object
    const newWorkout = {
        workout: {
            _id: workoutId, name: workoutName,
        }, note: workoutNote
    }

    const currentDayPlan = workoutPlans.find((workoutPlan) => workoutPlan.day === selectedDay);
    if (currentDayPlan) {
        currentDayPlan[category].push(newWorkout);
    }

    // Update backend
    try {
        const dayNumber = WEEKDAYS.findIndex(day => day.toLowerCase() === selectedDay);
        workoutPlans[dayNumber] = await updateWorkoutPlanByDay(selectedDay, currentDayPlan)
        displayWorkout(workoutPlans[dayNumber]);
    } catch (e) {
        console.log(e)
    }
}

// Edit workout in the plan
const toggleWorkoutContainer = async (e) => {
    const clickedEditButton = e.target
    const parent = clickedEditButton.closest(".workout-list-item")
    parent.querySelector(".edit-workout").classList.toggle('hidden')
    parent.querySelector(".workout-info").classList.add('hidden')
}

const toggleEditWorkoutForm = (e) => {
    const clickedEditButton = e.target
    const parent = clickedEditButton.closest(".workout-list-item")
    parent.querySelector(".edit-workout").classList.toggle('hidden')
    parent.querySelector(".workout-info").classList.remove('hidden')
}

const editWorkoutHandler = async (e, workoutId) => {
    const clickedEditButton = e.target

    const editInformationContainer = clickedEditButton.closest(".workout-list-item").querySelector(".workout-edited-details")
    const category = clickedEditButton.closest('.category-workouts-container').querySelector('h2').textContent.toLowerCase()

    const newNote = editInformationContainer.querySelector('.workout-note-edit-box').value

    // Find the workout plan for the current selected day
    const currentDayPlan = workoutPlans.find((workoutPlan) => workoutPlan.day === selectedDay);

    let workoutFound = false;
    currentDayPlan[category].map((workoutPlan) => {
        if (workoutPlan._id === workoutId) {
            workoutPlan.note = newNote
            workoutFound = true;
        }
    })

    if (!workoutFound) {
        console.error("Workout not found");
        return;
    }

    // Save the updated workout plan to the backend
    try {
        await updateWorkoutPlanByDay(selectedDay, currentDayPlan);
        displayWorkout(currentDayPlan); // Re-render the UI
    } catch (error) {
        console.error("Failed to update workout plan:", error);
    }
}

const displayWorkout = (workoutPlan) => {
    let workoutHTML = ""

    // Implementing Break day
    if (!workoutPlan.isBreakDay) {
        document.querySelector("#break-day").style.display = "none";
        $breakInput.checked = false;
        const categories = ["warmup", "workouts", "cooldown"]
        workoutHTML = categories.map((category) => `
    <section id="${category}-section">
    <div class="category-workouts-container">
    <div class="category-name-container">
      <h2>${category}</h2>
      <button type="submit" class="add-btn" onclick="toggleAddWorkoutForm(event)">Add</button>
    </div>
    <ul id="${category}-list">
    ${workoutPlan[category].map((workout) => `
        <div class="workout-list-item">
             <li class="workout-info">
                   <div class="workout-details-container">
                        <div class="workout-name">${workout.workout.name}</div>
                        <div class="workout-note">${workout.note}</div>
                   </div>
                   <div class="workout-button-container">
                        <button type="button" class="workout-card-button" onclick="deleteWorkoutHandler(event, '${workout._id}')"><span class="bi-trash3-fill"></span></button>
                        <button type="button" class="workout-card-button" onclick="toggleWorkoutContainer(event)"><span class="bi-pencil-square"></span></button>
                   </div>
            </li>
            <div class="edit-workout hidden" data-label="${category}-edit-button">
                <li class="workout-edited-details">
                    <div class="workout-details-container">
<!--                        <input type="text" class="workout-name-edit-box" style="margin-bottom:0.5rem;" name="workout-note" value="${workout.workout.name}"/>                             -->
                       <div class="workout-name" style="margin-bottom:0.5rem;">${workout.workout.name}</div>
                        <input type="text" class="workout-note-edit-box" name="workout-note" value="${workout.note}"/>
                    </div>
                    <div class="workout-button-container">
                        <button type="button" class="workout-card-button" onclick="toggleEditWorkoutForm(event)"><span style="font-size: 1.5rem;" class="bi-x"></span></button>
                        <button type="button" class="workout-card-button" onclick="editWorkoutHandler(event, '${workout._id}')"><span style="font-size: 1.5rem;" class="bi-check"></span></button>
                    </div>
                </li>
            </div>
        </div>
        `).join("\n")}
        <div class="new-workout hidden" data-label="${category}-add-button">
            <li>
                <div class="workout-details-container">
                    <select name="workout-list" class="workout-selection-box">
                    ${workouts.map((workout) => `
                      <option value="${workout._id}">${workout.name}</option>
                        `).join("\n")}
                    </select>
                    <input type="text" class="workout-note-edit-box" name="workout-note" value="10 reps 3 sets"/>
                </div>
                <div class="workout-button-container">
                    <button type="button" class="workout-card-button" onclick="toggleAddWorkoutForm(event)"><span style="font-size: 1.5rem;" class="bi-x"></span></button>
                    <button type="button" class="workout-card-button" onclick="saveEditWorkout(event)"><span style="font-size: 1.5rem;" class="bi-check"></span></button>
                </div>
            </li>
        </div>
        </div>
      `).join("\n")
    } else {
        document.querySelector("#break-day").style.display = "grid";
        $breakInput.checked = true;
    }
    const container = document.querySelector("#workout-plan-section")
    container.innerHTML = workoutHTML
}


weekdayButtons.forEach(button => {
    button.addEventListener('click', async (e) => {
        e.preventDefault();
        // Remove the active class from all buttons
        highlightWeekDayButton(e.target.textContent);
        selectedDay = button.textContent.toLowerCase();
        const dayWorkoutPan = workoutPlans.find((workoutPlan) => workoutPlan.day === button.textContent.toLowerCase());
        displayWorkout(dayWorkoutPan);
    })
})

$breakInput.addEventListener("change", async (e) => {
    const currentWorkoutPlan = workoutPlans.find(workoutPlan => workoutPlan.day === selectedDay);
    currentWorkoutPlan.isBreakDay = $breakInput.checked;
    await updateWorkoutPlanByDay(selectedDay, currentWorkoutPlan);
    displayWorkout(currentWorkoutPlan);
})

initWorkoutPlans()
