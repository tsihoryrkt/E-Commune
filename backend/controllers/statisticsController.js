const Project = require('../models/Project');
const Task = require('../models/Task');
const User = require('../models/User');

// Get the number of projects
const getProjectCount = async (req, res) => {
    try {
        const projectCount = await Project.countDocuments();
        console.log(projectCount);
        res.status(200).json({ projectCount });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get task statistics
const getTaskStats = async (req, res) => {
    try {
        const totalTasks = await Task.countDocuments();
        const pendingTasks = await Task.countDocuments({ status: 'Pending' });
        const inProgerssTasks = await Task.countDocuments({ status: 'In Progress'});
        const completedTasks = await Task.countDocuments({ status: 'Completed' });
        res.status(200).json({ totalTasks, pendingTasks, inProgerssTasks, completedTasks });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get the number of users
const getUserCount = async (req, res) => {
    try {
        const userCount = await User.countDocuments();
        res.status(200).json({ userCount });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {
    getProjectCount,
    getTaskStats,
    getUserCount
};
