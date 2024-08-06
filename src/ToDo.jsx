import React, { useState, useEffect } from "react";

function ToDo() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [editIndex, setEditIndex] = useState(null);


  useEffect(() => {
    const storedTasks = localStorage.getItem("tasks");
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }
  }, []);
  
  // Save tasks to local storage whenever they change
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
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
    const updatedTasks = tasks.map((task, i) =>
      i === index ? { ...task, done: !task.done } : task
    );
    setTasks(updatedTasks);
  }

  function deleteTask(index) {
    if (window.confirm("Are you sure you want to delete this task?")) {
      setTasks(tasks.filter((_, i) => i !== index));
    }
  }

  function deleteAllTasks() {
    if (window.confirm("Are you sure you want to delete all tasks?")) {
      setTasks([]);
    }
  }

  function markAllAsDone() {
    const updatedTasks = tasks.map((task) => ({ ...task, done: true }));
    setTasks(updatedTasks);
  }

  function startEditing(index) {
    setEditIndex(index);
    setNewTask(tasks[index].text);
    setNewDate(tasks[index].date);
    setNewTime(tasks[index].time);
  }

  function updateTask() {
    if (newTask.trim() !== "") {
      const updatedTasks = tasks.map((task, i) =>
        i === editIndex
          ? { ...task, text: newTask, date: newDate, time: newTime }
          : task
      );
      setTasks(updatedTasks);
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
          <input
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
                >
                  {task.done ? "Undone" : "Done"}
                </button>
                <button
                  className="edit-button"
                  onClick={() => startEditing(index)}
                >
                  ✎
                </button>
                <button
                  className="delete-button"
                  onClick={() => deleteTask(index)}
                >
                  🗑
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="task-actions">
          <button className="delete-all-button" onClick={deleteAllTasks}>
            Delete All
          </button>
          <button className="mark-all-done-button" onClick={markAllAsDone}>
            Mark All as Done
          </button>
        </div>
      </div>
    </div>
  );
}

export default ToDo;
