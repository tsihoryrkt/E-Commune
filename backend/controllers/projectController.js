const path = require('path');
const jwt = require('jsonwebtoken');
const multer = require('multer');

const Project = require('../models/Project');
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

// Endpoint for deleting project
const deleteProject = async (req, res) => {
    const projectId = req.params.projectId;
    console.log('project to del: ', projectId);
    try {
        const project = await Project.findById(projectId);

        if(!project){
            return res.status(404).json({ message: 'project not found' });
        }

        // Deleting associated task 
        await Task.deleteMany({ project: projectId });
        
        await Project.findByIdAndDelete(projectId);
        res.status(200).json({ message: 'Project deleted successfully'});
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Endpoint for updating project information
const updateProject = async (req, res) => {
    const{ projectId } = req.params
    const { name, description, members, startDate, endDate } = req.body;
    const startDateObject = startDate ? new Date(startDate) : null;
    const endDateObject = endDate ? new Date(endDate) : null;
    
    try {
        const project = await Project.findById(projectId);
        if(!project){
            console.log('Project not found for ID ' + projectId);
            return res.status(404).send({ error: 'Project not found' });
        }

        const oldMembers = project.members.map(member => member.toString());

        project.name = name || project.name;
        project.description = description || project.description;
        project.members = members ? JSON.parse(members) : project.members;
        project.startDate = startDateObject || project.startDate;
        project.endDate = endDateObject || project.endDate;

        const updatedProject = await project.save();

        const newMembers = updatedProject.members.map(member => member.toString());
        const removedMembers = oldMembers.filter(member => !newMembers.includes(member));

        if (removedMembers.length > 0) {
            // Find tasks associated with the project
            const tasks = await Task.find({ project: projectId });

            for (const task of tasks) {
                // Remove the removed members from the task's assignedTo field
                task.assignedTo = task.assignedTo.filter(assignedMember => !removedMembers.includes(assignedMember.toString()));
                await task.save();
            }
        }

        res.status(200).send({ message: 'Project updated successfully', project: updatedProject });
    }
    catch(error) {
        res.status(500).send({ error: 'Internal server error' });
    };

}

// Endpoint for searching user project
const searchUserProject = async (req, res) => {
    const userId = req.userId
    const searchTerm = req.query.searchTerm;
    try{
        const project = await Project.find({
            members: userId,
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

// EndPoint for fetching project details
const fetchProject = async (req, res) => {
    const projectId = req.query.projectId;
    try {
        const project = await Project.findById(projectId);
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
    searchProject,
    deleteProject,
    updateProject,
    searchUserProject,
    fetchProject
}