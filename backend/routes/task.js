const express = require('express');
const router = express.Router();
const taskcontroller = require('../controllers/taskController');

router.post('/create', taskcontroller.verifyToken, taskcontroller.upload.none(), taskcontroller.createTask);
router.get('/search', taskcontroller.verifyToken, taskcontroller.searchTask);
router.get('/byProject', taskcontroller.verifyToken, taskcontroller.fetchProjectTask);
router.get('/searchUserTask', taskcontroller.verifyToken, taskcontroller.searchUserTask);
router.put('/update/:taskId', taskcontroller.verifyToken, taskcontroller.upload.none(), taskcontroller.updateTask);
router.delete('/:taskId', taskcontroller.verifyToken, taskcontroller.deleteTask);

module.exports = router;