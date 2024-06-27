const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt')

const UserSchema = new Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    mobileNumber: { type: String, required: true },
    image: { type: String },
    isAdmin: { type: Boolean, default: false } // Field to mark if the user is administrator
})

// Middleware to hach the password before saving the user
UserSchema.pre('save', async function(next) {
    try {
      // Do not hash the password unless it is changed or new
      if (!this.isModified('password')) {
        return next();
      }
  
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(this.password, salt);
      this.password = hashedPassword;
      next();
    } catch (error) {
      next(error);
    }
});

// Méthod for comparing password
UserSchema.methods.isValidPassword = async function(password) {
    try {
      return await bcrypt.compare(password, this.password);
    } catch (error) {
      throw error;
    }
  };
  
const User = mongoose.model('User', UserSchema);
  
module.exports = User;
  