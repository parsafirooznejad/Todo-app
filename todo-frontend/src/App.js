import React, { useState, useEffect } from "react";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/tasks")
      .then((res) => res.json())
      .then((data) => setTasks(data));
  }, []);

  const addTask = () => {
    if (!title) return;
    fetch("http://localhost:5000/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    })
      .then((res) => res.json())
      .then((newTask) => {
        setTasks([...tasks, newTask]);
        setTitle("");
      });
  };

  const deleteTask = (id) => {
    fetch(`http://localhost:5000/tasks/${id}`, {
      method: "DELETE",
    })
      .then(() => {
        setTasks(tasks.filter((task) => task.id !== id));
      })
      .catch((err) => console.error("deleting error", err));
  };

  const editTask = (id, newTitle) => {
    fetch(`http://localhost:5000/tasks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTitle }),
    })
      .then((res) => res.json())
      .then((updateTask) => {
        setTasks(tasks.map((task) => (task.id === id ? updateTask : task)));
      })
      .catch((err) => console.error("editing error", err));
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>To-Do App</h1>
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
                    setTasks([...tasks]); // reRender
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
                    task.isEditing = true; // activates editing mode
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

export default App;
