const express = require('express');
const auth = require('../middleware/auth');
let { tasks, saveTasks, nextId } = require('../utils/storage');
const router = express.Router();

router.post('/', auth, (req, resp) => {
    const { title, description, dueDate, priority, tags, subtasks } = req.body;
    if (!title) return resp.status(400).json({ error: "Title is required" });

    let task = {
        id: nextId++,
        userId: req.user.userId,
        title,
        description: description || "",
        dueDate: dueDate || null,
        priority: priority || "normal",
        tags: tags || [],
        status: "pending",
        createdAt: new Date(),
        updatedAt: new Date(),
        subtasks: subtasks?.map((st, i) => ({ id: i + 1, title: st.title || "", status: st.status || "pending" })) || []
    };

    tasks.push(task);
    saveTasks();
    resp.status(201).json(task);
});

router.get("/", auth, (req, resp) => {
    const { status, priority, q } = req.query;
    let filteredTasks = tasks.filter(t => t.userId === req.user.userId);

    if (status) filteredTasks = filteredTasks.filter(t => t.status === status);
    if (priority) filteredTasks = filteredTasks.filter(t => t.priority === priority);
    if (q) filteredTasks = filteredTasks.filter(t => t.title.includes(q) || t.description.includes(q));

    resp.json(filteredTasks);
});

router.delete("/:id", auth, (req, resp) => {
    const index = tasks.findIndex(t => t.id == req.params.id && t.userId === req.user.userId);
    if (index === -1) return resp.status(404).json({ error: "Task not found" });

    const removedTask = tasks.splice(index, 1)[0];
    saveTasks();
    resp.json(removedTask);
});

module.exports = router;