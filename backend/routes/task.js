const express = require('express');
const router = express.Router();
const taskcontroller = require('../controllers/taskController');

router.post('/create', taskcontroller.verifyToken, taskcontroller.upload.none(), taskcontroller.createTask);
router.get('/search', taskcontroller.verifyToken, taskcontroller.searchTask);
router.put('/update/:taskId', taskcontroller.verifyToken, taskcontroller.upload.none(), taskcontroller.updateTask);

module.exports = router;