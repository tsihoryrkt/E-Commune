const express = require('express');
const router = express.Router();
const taskcontroller = require('../controllers/taskController');

router.post('/create', taskcontroller.verifyToken, taskcontroller.upload.none(), taskcontroller.createTask);
router.get('/search', taskcontroller.verifyToken, taskcontroller.searchTask);

module.exports = router;