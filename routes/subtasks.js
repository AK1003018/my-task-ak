const express = require('express');
const auth = require('../middleware/auth');
const { tasks, saveTasks } = require('../utils/storage');
const router = express.Router({ mergeParams: true });

router.post('/', auth, (req, resp) => {
    const task = tasks.find(t => t.id == req.params.taskId && t.userId === req.user.userId);
    if (!task) return resp.status(404).json({ error: "Task not found" });

    const newId = task.subtasks.length > 0 ? Math.max(...task.subtasks.map(st => st.id)) + 1 : 1;
    const subtask = { id: newId, title: req.body.title || "", status: "pending" };

    task.subtasks.push(subtask);
    task.updatedAt = new Date();
    saveTasks();
    resp.status(201).json(subtask);
});

router.patch('/:subtaskId', auth, (req, resp) => {
    const task = tasks.find(t => t.id == req.params.taskId && t.userId === req.user.userId);
    if (!task) return resp.status(404).json({ error: "Task not found" });

    const subtask = task.subtasks.find(st => st.id == req.params.subtaskId);
    if (!subtask) return resp.status(404).json({ error: "Subtask not found" });

    if (req.body.title) subtask.title = req.body.title;
    if (req.body.status) subtask.status = req.body.status;

    task.updatedAt = new Date();
    saveTasks();
    resp.json(subtask);
});

router.delete('/:subtaskId', auth, (req, resp) => {
    const task = tasks.find(t => t.id == req.params.taskId && t.userId === req.user.userId);
    if (!task) return resp.status(404).json({ error: "Task not found" });

    task.subtasks = task.subtasks.filter(st => st.id != req.params.subtaskId);
    task.updatedAt = new Date();
    saveTasks();
    resp.json({ message: "Subtask deleted" });
});

module.exports = router;