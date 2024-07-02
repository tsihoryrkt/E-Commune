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

// Middleware to verify the jeton
function verifyToken(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).json({ message: 'No token provided' });
  
        jwt.verify(token.split(' ')[1], 'your_jwt_secret', (err, decoded) => {
        if (err) return res.status(500).json({ message: 'Failed to authenticate token' });
  
        req.userId = decoded.userId;
        next();
    });
}

// Endpoint for subscription
const register = async (req, res) => {
    const { name, email, mobileNumber, password, isAdmin } = req.body;
    const image = req.file ? req.file.filename : null;
  
    try {
      // Vérify if the email is already used
      const existingEmail = await User.findOne({ email });
      if (existingEmail) {
        return res.status(400).json({ error: 'Email already in use' });
      }
  
      // Vérify if the phone number is already used
      const existingMobileNumber = await User.findOne({ mobileNumber });
      if (existingMobileNumber) {
        return res.status(400).json({ error: 'Mobile number already in use' });
      }
  
      // Create a new user
      const newUser = new User({
        name,
        email,
        mobileNumber,
        password,
        isAdmin, // Add attribut isAdmin
        image
      });
  
      // Saving the user to the database
      await newUser.save();
      res.status(200).json({ message: 'Registration successful' });
    } 
    catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

//Endpoint for connexion
const login = async (req, res) => {
    const {email, password } = req.body;
    
    try {
      // Find user via email
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
  
      // Verify if password is valid
      const isValid = await user.isValidPassword(password);
      if (!isValid) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
  
      // Generate a JWT token for the user
      const token = jwt.sign({ userId: user._id, isAdmin: user.isAdmin }, 'your_jwt_secret', { expiresIn: '1h' });
  
      // send the response with the token and admin statut
      res.json({ token, isAdmin: user.isAdmin });
    }
    catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
}

// Endpoint for fetching user information
const fetchUser = async (req, res) => {
    const userId = req.userId;
    User.findById(userId)
        .then(user => {
            if(!user){
                return res.status(404).send({ error: 'User not found' });
            }
            res.send(user)
        })

        .catch(err => {
            res.status(500).send({ error: 'Internal server error' });
        });
    
}

// Endpoint for updating user information
const updateUserProfile = async (req, res) => {
    const userId = req.userId;
    try {
        
          const user = await User.findById(userId);  
          if(!user){
              console.log('user not found for ID ' + userId);
              return res.status(404).send({ error: 'User not found' });
          } 
            
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            user.mobileNumber = req.body.mobileNumber || user.mobileNumber;

            if(req.file){
                user.image = req.file.filename;
            }
            
            const updatedUser = await user.save();
            res.send({ message: 'User profile updated successfully', user: updatedUser});
            
        }
            
        catch(error) {
            res.status(500).send({ error: 'Internal server error' });
        };

}

// Endpoint for searching user
const searchUser = async (req, res) => {
    const searchTerm = req.query.searchTerm;
    try {
        const user = await User.find({
            $or: [
                {name: { $regex: searchTerm, $options: 'i'}}, // Case sensitive by name
                {email: { $regex: searchTerm, $options: 'i'}} // Case sensitive by email
            ]
        });
        res.send(user);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Endpoint for deleding user
const deleteUser = async (req, res) => {
    const userId = req.params.userId;
    console.log('here are e ' + userId);

    try{
        const user = await User.findById(userId);
        
        if(!user){
            return res.status(404).json({ message: 'User not found' });
        }

        await User.findByIdAndDelete(userId);
        res.status(200).json({ message: 'User deleted successfully'});
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Endpoint for fetching members
const fetchMembers = async (req, res) => {
    const membersId = req.query.membersId;
    console.log('members e ', membersId);
    try {
        const members = await User.find({
             _id: { $in: membersId } 
        });

        res.send(members)


    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

              
  
module.exports = {
    register,
    login,
    upload,
    verifyToken,
    fetchUser,
    updateUserProfile,
    searchUser,
    deleteUser,
    fetchMembers
}
