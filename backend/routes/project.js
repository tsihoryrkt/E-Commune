const express = require('express');
const router = express.Router();
const projectcontroller = require('../controllers/projectController');

router.post('/create', projectcontroller.verifyToken, projectcontroller.upload.none(), projectcontroller.createProject);
router.get('/search', projectcontroller.verifyToken, projectcontroller.searchProject);

module.exports = router;