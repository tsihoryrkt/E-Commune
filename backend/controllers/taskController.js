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

module.exports = {
    upload,
    verifyToken,
    createTask
}