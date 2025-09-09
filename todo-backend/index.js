const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 5000;

// storage array
let tasks = [];

// ROOT Directory
app.get("/", (req, res) => {
  res.send("Backend is running");
});

// GET API to recive the tasks list
app.get("/tasks", (req, res) => {
  res.json(tasks);
});

// POST API to add a new task
app.post("/tasks", (req, res) => {
  const { title } = req.body;
  const newTask = { id: tasks.length + 1, title };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

// PUT API to edit a task
app.put("/tasks/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const task = tasks.find((t) => t.id === id);
  if (task) {
    task.title = req.body.title || task.title;
    res.json(task);
  } else {
    res.status(404).json({ message: "Task Not Found" });
  }
});

// DELETE API to remove a task
app.delete("/tasks/:id", (req, res) => {
  const id = parseInt(req.params.id);
  tasks = tasks.filter((task) => task.id !== id);
  res.json({ message: "Task Deleted" });
});

// Running  The Server
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
