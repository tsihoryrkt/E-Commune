const path = require('path');
const multer = require('multer');
const jwt = require('jsonwebtoken');

const User = require('../models/User');

// Configuration of the multer for images download
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/'); // Folder where images will be saved
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname)); // unique name for the image
    }
  });

const upload = multer({ storage: storage });

// Middleware to verifie the jeton
function verifyToken(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).json({ message: 'No token provided' });
  
        jwt.verify(token.split(' ')[1], 'your_jwt_secret', (err, decoded) => {
        if (err) return res.status(500).json({ message: 'Failed to authenticate token' });
  
        req.userId = decoded.userId;
        next();
    });
}

// Endpoint pour l'inscription
const register = async (req, res) => {
    const { name, email, mobileNumber, password, isAdmin } = req.body;
    const image = req.file ? req.file.filename : null;
  
    try {
      // Vérifier si l'email est déjà utilisé
      const existingEmail = await User.findOne({ email });
      if (existingEmail) {
        return res.status(400).json({ error: 'Email already in use' });
      }
  
      // Vérifier si le numéro de téléphone est déjà utilisé
      const existingMobileNumber = await User.findOne({ mobileNumber });
      if (existingMobileNumber) {
        return res.status(400).json({ error: 'Mobile number already in use' });
      }
  
      // Créer un nouvel utilisateur
      const newUser = new User({
        name,
        email,
        mobileNumber,
        password,
        isAdmin, // Ajouter l'attribut isAdmin
        image
      });
  
      // Sauvegarder l'utilisateur dans la base de données
      await newUser.save();
      res.status(200).json({ message: 'Registration successful' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
  
module.exports = {
    register,
    upload
}
