const addButton = document.querySelector("button");
const taskInput = document.querySelector('input[type="text"]');
const dateInput = document.querySelector('input[type="date"]');

const todayList = document.getElementById("today-tasks");
const upcomingList = document.getElementById("upcoming-tasks");
const lostList = document.getElementById("lost-tasks");

let tasks = [];

// Take input from the user and add to the array
addButton.addEventListener("click", () => {
  const task = taskInput.value.trim();
  const date = dateInput.value;

  if (task === "") return;

  tasks.push({ task, date, completed: false });

  taskInput.value = "";
  dateInput.value = "";

  renderTasks();
});

// After receiving the task details render it in the correct block
function renderTasks() {
  todayList.innerHTML = "";
  upcomingList.innerHTML = "";
  lostList.innerHTML = "";

  const today = new Date().toISOString().split("T")[0];

  // Sort by date
  tasks.sort((a, b) => new Date(a.date || today) - new Date(b.date || today));

  tasks.forEach((item, index) => {
    const taskItem = document.createElement("div");

    // Format the date as "dd MMM yyyy"
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
      taskItem.classList.add(
        "line-through",
        "bg-[#50586C]",
        "text-[#DCE2F0]"
      );
    } else {
      taskItem.classList.add(
        "bg-[#DCE2F0]",
        "text-[#50586C]",
        "hover:bg-[#50586C]",
        "hover:text-[#DCE2F0]"
      );
    }

    // Toggle completed state on click
    taskItem.addEventListener("click", () => {
      tasks[index].completed = !tasks[index].completed;
      renderTasks();
    });

    // Delete on right-click
    taskItem.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      tasks.splice(index, 1);
      renderTasks();
    });

    // Append to correct section
    if (!item.date || item.date === today) {
      todayList.appendChild(taskItem);
    } else if (item.date > today) {
      upcomingList.appendChild(taskItem);
    } else {
      lostList.appendChild(taskItem);
    }
  });
}
