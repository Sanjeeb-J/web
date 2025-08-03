const addButton = document.querySelector("button");
const taskInput = document.querySelector('input[type="text"]');
const dateInput = document.querySelector('input[type="date"]');

const todayList = document.getElementById("today-tasks");
const upcomingList = document.getElementById("upcoming-tasks");
const lostList = document.getElementById("lost-tasks");

let tasks = [];

// Add task to Firebase
async function addTaskToFirebase(taskObj) {
  await db.collection("tasks").add(taskObj);
}

// Load tasks from Firebase
async function loadTasksFromFirebase() {
  const snapshot = await db.collection("tasks").get();
  tasks = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  renderTasks();
}

// Delete task from Firebase
async function deleteTaskFromFirebase(id) {
  await db.collection("tasks").doc(id).delete();
}

// Toggle completion in Firebase
async function toggleCompleteInFirebase(id, completed) {
  await db.collection("tasks").doc(id).update({ completed });
}

// Add task from UI
addButton.addEventListener("click", async () => {
  const task = taskInput.value.trim();
  const date = dateInput.value;

  if (task === "") return;

  const newTask = { task, date, completed: false };

  await addTaskToFirebase(newTask);

  taskInput.value = "";
  dateInput.value = "";

  await loadTasksFromFirebase(); // reload with new task
});

// Render tasks
function renderTasks() {
  todayList.innerHTML = "";
  upcomingList.innerHTML = "";
  lostList.innerHTML = "";

  const today = new Date().toISOString().split("T")[0];

  // Sort by date
  tasks.sort((a, b) => new Date(a.date || today) - new Date(b.date || today));

  tasks.forEach((item) => {
    const taskItem = document.createElement("div");

    const formattedDate = item.date
      ? new Date(item.date).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "No Date";

    taskItem.textContent = `${item.task} - ${formattedDate}`;

    taskItem.className =
      "border rounded-xl p-2 text-center cursor-pointer flex-1 m-1 transition-all duration-200";

    if (item.completed) {
      taskItem.classList.add("line-through", "bg-[#50586C]", "text-[#DCE2F0]");
    } else {
      taskItem.classList.add(
        "bg-[#DCE2F0]",
        "text-[#50586C]",
        "hover:bg-[#50586C]",
        "hover:text-[#DCE2F0]"
      );
    }

    // Toggle completed state on click
    taskItem.addEventListener("click", async () => {
      await toggleCompleteInFirebase(item.id, !item.completed);
      await loadTasksFromFirebase();
    });

    // Delete on right-click
    taskItem.addEventListener("contextmenu", async (e) => {
      e.preventDefault();
      await deleteTaskFromFirebase(item.id);
      await loadTasksFromFirebase();
    });

    if (!item.date || item.date === today) {
      todayList.appendChild(taskItem);
    } else if (item.date > today) {
      upcomingList.appendChild(taskItem);
    } else {
      lostList.appendChild(taskItem);
    }
  });
}

// 🔃 Load tasks when page loads
window.onload = loadTasksFromFirebase;
