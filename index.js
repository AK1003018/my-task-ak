const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');
const subtaskRoutes = require('./routes/subtasks');

const app = express();
const port = 3000;

app.use(cors({origin: 'https://my-tasks-new.vercel.app/'}));
app.use(express.json());

app.use('/api', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/tasks/:taskId/subtasks', subtaskRoutes);

app.listen(port, () => console.log(`🚀 Server running on port ${port}`));
