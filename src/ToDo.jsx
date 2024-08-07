import React, { useState, useEffect } from "react";

function ToDo() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    try {
      const storedTasks = localStorage.getItem("tasks");
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks));
      }
    } catch (error) {
      console.error("Failed to load tasks from localStorage:", error);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    } catch (error) {
      console.error("Failed to save tasks to localStorage:", error);
    }
  }, [tasks]);

  function handleInputChange(event) {
    setNewTask(event.target.value);
  }

  function handleDateChange(event) {
    setNewDate(event.target.value);
  }

  function handleTimeChange(event) {
    setNewTime(event.target.value);
  }

  function addTask() {
    if (newTask.trim() !== "") {
      setTasks([
        ...tasks,
        { text: newTask, done: false, date: newDate, time: newTime },
      ]);
      setNewTask("");
      setNewDate("");
      setNewTime("");
    }
  }

  function toggleTaskStatus(index) {
    setTasks((prevTasks) =>
      prevTasks.map((task, i) =>
        i === index ? { ...task, done: !task.done } : task
      )
    );
  }

  function deleteTask(index) {
    if (window.confirm("Are you sure you want to delete this task?")) {
      setTasks((prevTasks) => prevTasks.filter((_, i) => i !== index));
    }
  }

  function deleteAllTasks() {
    if (window.confirm("Are you sure you want to delete all tasks?")) {
      setTasks([]);
    }
  }

  function markAllAsDone() {
    setTasks((prevTasks) => prevTasks.map((task) => ({ ...task, done: true })));
  }

  function startEditing(index) {
    setEditIndex(index);
    setNewTask(tasks[index].text);
    setNewDate(tasks[index].date);
    setNewTime(tasks[index].time);
  }

  function updateTask() {
    if (newTask.trim() !== "") {
      setTasks((prevTasks) =>
        prevTasks.map((task, i) =>
          i === editIndex
            ? { ...task, text: newTask, date: newDate, time: newTime }
            : task
        )
      );
      setNewTask("");
      setNewDate("");
      setNewTime("");
      setEditIndex(null);
    }
  }

  return (
    <div className="app-container">
      <div className="info-card">
        <h2>{editIndex !== null ? "Edit Task" : "Add Task"}</h2>
        <div>
          <textarea
            type="text"
            placeholder="What to do?"
            value={newTask}
            onChange={handleInputChange}
          />
          <input type="date" value={newDate} onChange={handleDateChange} />
          <input type="time" value={newTime} onChange={handleTimeChange} />
          <button
            className="add-button"
            onClick={editIndex !== null ? updateTask : addTask}
          >
            {editIndex !== null ? "Update" : "Add Task"}
          </button>
        </div>
      </div>

      <div className="task-list">
        <h1>Tasks</h1>
        <div>
          {tasks.map((task, index) => (
            <div key={index} className="task-card">
              <div
                className="text"
                style={{
                  textDecoration: task.done ? "line-through" : "none",
                }}
              >
                <div>{task.text}</div>
                <div className="datetime">
                  {task.date && <span>Date: {task.date}</span>}
                  {task.time && <span> Time: {task.time}</span>}
                </div>
              </div>
              <div className="task-buttons">
                <button
                  className="done-button"
                  onClick={() => toggleTaskStatus(index)}
                  aria-label={task.done ? "Mark as Undone" : "Mark as Done"}
                >
                  {task.done ? "Undone" : "Done"}
                </button>
                <button
                  className="edit-button"
                  onClick={() => startEditing(index)}
                  aria-label="Edit Task"
                >
                  ✎
                </button>
                <button
                  className="delete-button"
                  onClick={() => deleteTask(index)}
                  aria-label="Delete Task"
                >
                  🗑
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="task-actions">
          <button
            className="delete-all-button"
            onClick={deleteAllTasks}
            aria-label="Delete All Tasks"
          >
            Delete All
          </button>
          <button
            className="mark-all-done-button"
            onClick={markAllAsDone}
            aria-label="Mark All Tasks as Done"
          >
            Mark All as Done
          </button>
        </div>
      </div>
    </div>
  );
}

export default ToDo;
