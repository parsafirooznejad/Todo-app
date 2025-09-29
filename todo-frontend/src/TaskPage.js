import React, { useState, useEffect } from "react";

function TaskPage({ token, logout }) {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/tasks", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setTasks(data))
      .catch((err) => console.error("Error fetching tasks:", err));
  }, [token]);

  const addTask = () => {
    if (!title) return;
    fetch("http://localhost:5000/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title }),
    })
      .then((res) => res.json())
      .then((newTask) => {
        setTasks([...tasks, newTask]);
        setTitle("");
      })
      .catch((err) => console.error("Error adding task:", err));
  };

  const deleteTask = (id) => {
    fetch(`http://localhost:5000/tasks/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(() => {
        setTasks(tasks.filter((task) => task.id !== id));
      })
      .catch((err) => console.error("Error deleting task:", err));
  };

  const editTask = (id, newTitle) => {
    fetch(`http://localhost:5000/tasks/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title: newTitle }),
    })
      .then((res) => res.json())
      .then((updatedTask) => {
        setTasks(tasks.map((task) => (task.id === id ? updatedTask : task)));
      })
      .catch((err) => console.error("Error editing task:", err));
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>To-Do App</h1>
      <button onClick={logout}>Logout</button>

      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Task's title"
      />
      <button onClick={addTask}>Add</button>

      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            {task.isEditing ? (
              <>
                <input
                  type="text"
                  defaultValue={task.newTitle ?? task.title}
                  onChange={(e) => {
                    task.newTitle = e.target.value;
                    setTasks([...tasks]); // re-render
                  }}
                />
                <button
                  onClick={() => {
                    editTask(task.id, task.newTitle || task.title);
                  }}
                >
                  Save
                </button>
              </>
            ) : (
              <>
                {task.title}
                <button onClick={() => deleteTask(task.id)}>Delete</button>
                <button
                  onClick={() => {
                    task.isEditing = true; // editing mode
                    setTasks([...tasks]);
                  }}
                >
                  Edit
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TaskPage;
