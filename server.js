require ("dotenv").config();
const express = require("express");
const app = express();

//Port Listening    
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON request bodies
app.use(express.json());

// In-memory database for onboarding tasks
let onboardingChecklist = [
  { 
    id: '1',
    employeeName: 'Jane Doe',
    taskTitle: 'Sign Employment Contract',
    department: 'Engineering',
    completed: false,
    dueDate: '2026-11-10',
  }
];

// READ: Get a single task by ID
app.get('/api/onboarding/:id', (req, res) => {
  const task = onboardingChecklist.find((t) => t.id === req.params.id);
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }
  res.json({ data: task });
});

// CREATE: Add a new onboarding task
app.post('/api/onboarding', (req, res) => {
  const { employeeName, taskTitle, department, dueDate } = req.body;

  if (!employeeName || !taskTitle) {
    return res.status(400).json({ error: 'employeeName and taskTitle are required.' });
  }

  const newTask = {
    id: uuidv4(),
    employeeName,
    taskTitle,
    department: department || 'General',
    completed: false,
    dueDate: dueDate || null,
  };

  onboardingChecklist.push(newTask);
  res.status(201).json({ message: 'Task created', data: newTask });
});

// READ: Get all onboarding tasks (with optional filter by employeeName)
app.get('/api/onboarding', (req, res) => {
  const { employeeName } = req.query;
  if (employeeName) {
    const filtered = onboardingChecklist.filter(
      (task) => task.employeeName.toLowerCase() === employeeName.toLowerCase()
    );
    return res.json({ data: filtered });
  }
  res.json({ data: onboardingChecklist });
});

// UPDATE: Full or partial update of a task by ID
app.put('/api/onboarding/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const taskIndex = onboardingChecklist.findIndex((t) => t.id === id);
  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found' });
      }

  Object.assign(onboardingChecklist[taskIndex], req.body);
  res.json({ message: 'Task updated', data: onboardingChecklist[taskIndex] });
});

// DELETE: Remove a task by ID
app.delete('/api/onboarding/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const taskIndex = onboardingChecklist.findIndex((t) => t.id === id);
  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }

  const deletedTask = onboardingChecklist.splice(taskIndex, 1);
  res.json({ message: 'Task deleted', data: deletedTask[0] });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 