const express = require("express");
const cors = require("cors");
const sequelize = require("./database");
const User = require("./models/User");
const Task = require("./models/Task");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 5000;

// Connecting to db and creating tables(if not existed)
sequelize
  .sync()
  .then(() => console.log("✅ Database & tables created!"))
  .catch((err) => console.error("❌ Error syncing database:", err));

// 🔹 Middleware to protect APIs
function authenticationToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// -------------------- AUTH ROUTES --------------------

// Register
app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ username, email, password: hashedPassword });
  res.status(201).json({ message: "User registered successfully" });
});

// Login
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ where: { username } });

  if (!user) return res.status(404).json({ error: "User not found" });

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid)
    return res.status(401).json({ error: "Invalid credentials" });

  const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, {
    expiresIn: "1h",
  });

  res.json({ message: "Login successful", token });
});

// -------------------- TASK ROUTES --------------------

// GET API to recive all tasks from db
app.get("/tasks", authenticationToken, async (req, res) => {
  try {
    const tasks = await Task.findAll({
      where: { userId: req.user.id },
    });
    res.json(tasks);
  } catch (err) {
    console.error("Error fetching tasks:", err);
    res.status(500).json({ message: "Error fetching tasks" });
  }
});

// POST API to add a new task to db
app.post("/tasks", authenticationToken, async (req, res) => {
  try {
    const { title, description, deadline } = req.body;
    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }
    const task = await Task.create({
      title,
      description,
      deadline,
      userId: req.user.id,
    });
    res.status(201).json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create task" });
  }
});

// PUT API to edit a task in db
app.put("/tasks/:id", authenticationToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, deadline, completed } = req.body;

    const task = await Task.findOne({
      where: { id, userId: req.user.id },
    });
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    task.title = title ?? task.title;
    task.description = description ?? task.description;
    task.deadline = deadline ?? task.deadline;
    task.completed = completed ?? task.completed;

    await task.save();
    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update task" });
  }
});

// DELETE API to remove a task from db
app.delete("/tasks/:id", authenticationToken, async (req, res) => {
  try {
    const { id } = req.params;

    const deletedCount = await Task.destroy({
      where: { id, userId: req.user.id }, // 🔹 فقط همون کاربر
    });

    if (deletedCount === 0) {
      return res.status(404).json({ error: "Task not found" });
    }
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete task" });
  }
});

// -------------------- SERVER --------------------
sequelize
  .sync()
  .then(() => {
    console.log("Database synced successfully");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => console.error("Database sync failed:", err));
