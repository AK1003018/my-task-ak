const fs = require('fs');
const path = require('path');

const USERS_FILE = path.join(__dirname, '../users.json');
const TASKS_FILE = path.join(__dirname, '../tasks.json');

let users = [];
let tasks = [];
let nextId = 1;

function loadUsers() {
    if (fs.existsSync(USERS_FILE)) {
        users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'));
    }
}

function saveUsers() {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

function loadTasks() {
    if (fs.existsSync(TASKS_FILE)) {
        tasks = JSON.parse(fs.readFileSync(TASKS_FILE, 'utf-8'));
        nextId = tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1;
    }
}

function saveTasks() {
    fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2));
}

loadUsers();
loadTasks();

module.exports = { users, saveUsers, tasks, saveTasks, nextId };