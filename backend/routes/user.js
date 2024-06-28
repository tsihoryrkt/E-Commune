const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController')

router.get('/profile', userController.verifyToken, userController.authenticateToken);

router.put('/update', userController.verifyToken, userController.upload.single('image'), userController.updateUserProfile);
module.exports = router;