const express = require('express');
const router = express.Router();
const projectcontroller = require('../controllers/projectController');

router.post('/create', projectcontroller.verifyToken, projectcontroller.upload.none(), projectcontroller.createProject);
router.get('/search', projectcontroller.verifyToken, projectcontroller.searchProject);
router.delete('/:projectId', projectcontroller.verifyToken, projectcontroller.deleteProject);

module.exports = router;