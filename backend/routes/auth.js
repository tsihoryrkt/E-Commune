const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController')

router.post('/register', userController.upload.single('image'), userController.register);

router.post('/login', userController.login);

module.exports = router;