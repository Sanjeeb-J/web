
const addButton = document.querySelector("button");
const taskInput = document.querySelector('input[type="text"]');
const dateInput = document.querySelector('input[type="date"]');
const taskList = document.getElementById("task-list");

addButton.addEventListener("click", () => {
  const task = taskInput.value.trim();
  const date = dateInput.value;

  if (task === "") return;

  const taskItem = document.createElement("div");
  taskItem.className = "border rounded-xl p-2 text-center bg-[#F2AA4C] cursor-pointer hover:bg-[#f4b65f]";
  taskItem.textContent = `${task} - ${date || "No Date"}`;

    // 👇 Click to underline and move to bottom
  taskItem.addEventListener("click", () => {
  taskItem.classList.toggle("underline"); // underline
  taskList.removeChild(taskItem); // remove from current position
  taskList.appendChild(taskItem); // move to bottom
  });

  taskList.appendChild(taskItem);

  // Clear inputs
  taskInput.value = "";
  dateInput.value = "";
});
