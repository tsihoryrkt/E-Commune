const express = require('express');
const { getProjectCount, getTaskStats, getUserCount } = require('../controllers/statisticsController');
const router = express.Router();

router.get('/projects/count', getProjectCount);
router.get('/tasks/stats', getTaskStats);
router.get('/users/count', getUserCount);

module.exports = router;
