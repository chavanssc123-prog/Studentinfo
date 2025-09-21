const express = require('express');
const path = require('path');
const fs = require('fs').promises;

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'students.json');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Read students safely
async function readStudents() {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    return JSON.parse(data || '[]');
  } catch (err) {
    if (err.code === 'ENOENT') return [];
    throw err;
  }
}

// Write students
async function writeStudents(students) {
  await fs.writeFile(DATA_FILE, JSON.stringify(students, null, 2), 'utf8');
}

// API endpoints
app.get('/api/students', async (req, res) => {
  const students = await readStudents();
  res.json(students);
});

app.post('/api/students', async (req, res) => {
  const { name, roll, className, age } = req.body;
  if (!name || !roll) return res.status(400).json({ error: 'name and roll required' });

  const students = await readStudents();
  const newStudent = {
    id: Date.now().toString(),
    name,
    roll,
    class: className || '',
    age: age || ''
  };
  students.push(newStudent);
  await writeStudents(students);
  res.status(201).json(newStudent);
});

// Serve frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => console.log(`StudentInfo app running on port ${PORT}`));