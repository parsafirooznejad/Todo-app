import React, { useState, useEffect } from "react";

function TaskPage({ token, logout }) {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/tasks", {
      headers: { Authorization: `Bearer ${token}` },
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
      });
  };

  const deleteTask = (id) => {
    fetch(`http://localhost:5000/tasks/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    }).then(() => setTasks(tasks.filter((task) => task.id !== id)));
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
      .then((updatedTask) =>
        setTasks(tasks.map((task) => (task.id === id ? updatedTask : task)))
      );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-xl mx-auto bg-white shadow-lg rounded-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold">To-Do List</h1>
          <button
            onClick={logout}
            className="text-sm bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
          >
            Logout
          </button>
        </div>

        <div className="flex gap-2 mb-4">
          <input
            type="text"
            className="flex-1 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            placeholder="Task title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <button
            onClick={addTask}
            className="bg-blue-600 text-white px-4 rounded-lg hover:bg-blue-700"
          >
            Add
          </button>
        </div>

        <ul className="space-y-2">
          {tasks.map((task) => (
            <li
              key={task.id}
              className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border"
            >
              {task.isEditing ? (
                <>
                  <input
                    type="text"
                    defaultValue={task.title}
                    onChange={(e) => {
                      task.newTitle = e.target.value;
                      setTasks([...tasks]);
                    }}
                    className="border rounded px-2 py-1"
                  />
                  <button
                    onClick={() =>
                      editTask(task.id, task.newTitle || task.title)
                    }
                    className="text-sm bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600"
                  >
                    Save
                  </button>
                </>
              ) : (
                <>
                  <span>{task.title}</span>
                  <div className="space-x-2">
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="text-sm bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => {
                        task.isEditing = true;
                        setTasks([...tasks]);
                      }}
                      className="text-sm bg-yellow-500 text-white px-2 py-1 rounded-md hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default TaskPage;
