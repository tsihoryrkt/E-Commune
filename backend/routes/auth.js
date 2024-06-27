const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController')

router.post('/register', userController.upload.single('image'), userController.register);

module.exports = router;