// const express = require('express');
// const fs = require('fs');
// const path = require('path');
// const cors = require('cors');
// const bodyParser = require('body-parser');

// const app = express();
// const PORT = 5000;

// app.use(cors());
// app.use(bodyParser.json());
// app.use(express.static(path.join(__dirname, '../frontend')));
// const readJSON = (filePath) => {
//   try {
//     return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
//   } catch (err) {
//     return [];
//   }
// };

// const writeJSON = (filePath, data) => {
//   fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
// };

// // === Auth Routes ===
// app.post('/api/register', (req, res) => {
//   const usersPath = path.join(__dirname, './data/users.json');
//   const users = readJSON(usersPath);
//   const { username, password } = req.body;

//   if (users.find(u => u.username === username)) {
//     return res.status(400).json({ error: 'User already exists' });
//   }

//   users.push({ username, password });
//   writeJSON(usersPath, users);
//   res.json({ success: true });
// });

// app.post('/api/login', (req, res) => {
//   const users = readJSON(path.join(__dirname, './data/users.json'));
//   const { username, password } = req.body;

//   const user = users.find(u => u.username === username && u.password === password);
//   if (!user) {
//     return res.status(401).json({ error: 'Invalid credentials' });
//   }

//   res.json({ success: true });
// });
// app.get('/api/groups', (req, res) => {
//   const groups = readJSON(path.join(__dirname, './data/groups.json'));
//   res.json(groups);
// });

// app.post('/api/groups', (req, res) => {
//   const groupsPath = path.join(__dirname, './data/groups.json');
//   const groups = readJSON(groupsPath);
//   const { name, createdBy } = req.body;

//   const newGroup = {
//     id: Date.now(),
//     name,
//     createdBy
//   };

//   groups.push(newGroup);
//   writeJSON(groupsPath, groups);
//   res.json(newGroup);
// });

// // === Task Routes ===
// app.get('/api/tasks/:groupId', (req, res) => {
//   const groupId = parseInt(req.params.groupId);
//   const tasks = readJSON(path.join(__dirname, './data/tasks.json'));
//   const filtered = tasks.filter(task => task.groupId === groupId);
//   res.json(filtered);
// });

// app.post('/api/tasks', (req, res) => {
//   const tasksPath = path.join(__dirname, './data/tasks.json');
//   const tasks = readJSON(tasksPath);
//   const { groupId, title, assignedTo } = req.body;

//   const newTask = {
//     id: Date.now(),
//     groupId,
//     title,
//     assignedTo
//   };

//   tasks.push(newTask);
//   writeJSON(tasksPath, tasks);
//   res.json(newTask);
// });
// app.get('/api/comments/:taskId', (req, res) => {
//   const taskId = parseInt(req.params.taskId);
//   const comments = readJSON(path.join(__dirname, './data/comments.json'));
//   const filtered = comments.filter(c => c.taskId === taskId);
//   res.json(filtered);
// });

// app.post('/api/comments', (req, res) => {
//   const commentsPath = path.join(__dirname, './data/comments.json');
//   const comments = readJSON(commentsPath);
//   const { taskId, comment, author } = req.body;

//   const newComment = {
//     id: Date.now(),
//     taskId,
//     comment,
//     author
//   };

//   comments.push(newComment);
//   writeJSON(commentsPath, comments);
//   res.json(newComment);
// });
// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, '../frontend/index.html'));
// });
// app.listen(PORT, () => {
//   console.log(`✅ Server running at http://localhost:${PORT}`);
// });

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const multer = require('multer');

const app = express();
const PORT = 5000;

// MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/projectDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
console.log('Connected to MongoDB');

// Models
const User = mongoose.model('User', new mongoose.Schema({
  username: String,
  password: String,
}));

const Group = mongoose.model('Group', new mongoose.Schema({
  name: String,
  createdBy: String,
}));

const Task = mongoose.model('Task', new mongoose.Schema({
  groupId: mongoose.Schema.Types.ObjectId,
  title: String,
  assignedTo: String,
  attachment: String,
}));

const Comment = mongoose.model('Comment', new mongoose.Schema({
  taskId: mongoose.Schema.Types.ObjectId,
  author: String,
  comment: String,
}));

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, 'public/uploads'));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '_' + file.originalname);
  }
});
const upload = multer({ storage });

// Routes
app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;
  const exists = await User.findOne({ username });
  if (exists) return res.status(400).json({ error: 'User exists' });

  await User.create({ username, password });
  res.json({ success: true });
});

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username, password });
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });

  res.json({ success: true });
});

app.post('/api/groups', async (req, res) => {
  const group = await Group.create(req.body);
  res.json(group);
});

app.get('/api/groups', async (req, res) => {
  const groups = await Group.find();
  res.json(groups);
});

app.post('/api/tasks', upload.single('file'), async (req, res) => {
  const { title, groupId, assignedTo } = req.body;
  const attachment = req.file ? `/uploads/${req.file.filename}` : null;

  const task = await Task.create({
    title,
    groupId,
    assignedTo,
    attachment
  });
  res.json(task);
});

app.get('/api/tasks/:groupId', async (req, res) => {
  const tasks = await Task.find({ groupId: req.params.groupId });
  res.json(tasks);
});

app.post('/api/comments', async (req, res) => {
  const comment = await Comment.create(req.body);
  res.json(comment);
});

app.get('/api/comments/:taskId', async (req, res) => {
  const comments = await Comment.find({ taskId: req.params.taskId });
  res.json(comments);
});

// Serve frontend
app.use(express.static(path.join(__dirname, '../frontend')));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
