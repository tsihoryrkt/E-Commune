const path = require('path');
const jwt = require('jsonwebtoken');
const multer = require('multer');

const Task = require('../models/Task');

const upload = multer();

// Middleware to verify the jeton
function verifyToken(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).json({ message: 'No token provided' });

        jwt.verify(token.split(' ')[1], 'your_jwt_secret', (err, decoded) => {
        if (err) return res.status(500).json({ message: 'Failed to authenticate token' });
  
        req.userId = decoded.userId;
        next();
    });
}

// Endpoint for creating a new task
const createTask = async (req,res) => {
    const { title, description, project, dueDate } = req.body
    const dueDateObject = dueDate ? new Date(dueDate) : null;
    const descriptionValue = description || null;

    if (!title || !project) {
        return res.status(400).json({ message: 'Title and project are required' });
    }

    const newTask = new Task({
        title,
        description: descriptionValue,
        project,
        dueDate: dueDateObject
    });
    try {
        await newTask.save();
        res.status(200).json({message: 'success create'});
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
}

// Endpoint for searching task
const searchTask = async (req, res) => {
    const searchTerm = req.query.searchTerm;
    console.log('task mitady')
    try{
        const task = await Task.find({
            $or: [
                { title: { $regex: searchTerm, $options: 'i' } },
                { description: { $regex: searchTerm, $options: 'i' } }
            ]
        });
        res.send(task);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Endpoint for updating task information
const updateTask = async (req, res) => {
    const { taskId } = req.params;
    const { title, description, assignedTo, status, dueDate } = req.body;
    const dueDateObject = dueDate ? new Date(dueDate) : null;

    try{
        const task = await Task.findById(taskId);
        if(!task){
            console.log('Project not found for ID ' + projectId);
            return res.status(404).send({ error: 'Project not found' });
        }
        task.title = title || task.title;
        task.description = description || task.description;
        task.assignedTo = assignedTo ? JSON.parse(assignedTo) : task.assignedTo;
        task.status = status || task.status;
        task.dueDate = dueDateObject || task.dueDate;

        const updatedTask = await task.save();
        res.status(200).send({ message: 'Task updated successfully', task: updatedTask });
    }
    catch(error) {
        res.status(500).send({ error: 'Internal server error' });
    };
}

module.exports = {
    upload,
    verifyToken,
    createTask,
    searchTask,
    updateTask
}