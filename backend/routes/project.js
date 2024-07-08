const express = require('express');
const router = express.Router();
const projectcontroller = require('../controllers/projectController');

router.post('/create', projectcontroller.verifyToken, projectcontroller.upload.none(), projectcontroller.createProject);
router.get('/search', projectcontroller.verifyToken, projectcontroller.searchProject);
router.get('/searchUserProject', projectcontroller.verifyToken, projectcontroller.searchUserProject);
router.get('/projectDetails', projectcontroller.verifyToken, projectcontroller.fetchProject);
router.delete('/:projectId', projectcontroller.verifyToken, projectcontroller.deleteProject);
router.put('/update/:projectId', projectcontroller.verifyToken, projectcontroller.upload.none(), projectcontroller.updateProject);

module.exports = router;