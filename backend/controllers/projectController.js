const path = require('path');
const jwt = require('jsonwebtoken');
const multer = require('multer');

const Project = require('../models/Project');


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
// Endpoint for creating new project
const createProject = async (req,res) => {
    const { name, description, endDate } = req.body;

    const endDateObject = endDate ? new Date(endDate) : null;
    const descriptionValue = description || null;
    
    const newProject = new Project({ 
        name, 
        description: descriptionValue, 
        startDate: Date.now(), 
        endDate: endDateObject 
    });


    try {
        await newProject.save();
        res.status(200).json({ message: ' success create' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }

}

// Endpoint for searching project
const searchProject = async (req, res) => {
    const searchTerm = req.query.searchTerm;
    try{
        const project = await Project.find({
            $or: [
                { name: { $regex: searchTerm, $options: 'i' } },
                { description: { $regex: searchTerm, $options: 'i' } }
            ]
        });
        res.send(project);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    upload,
    verifyToken,
    createProject,
    searchProject
}