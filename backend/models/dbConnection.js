const mongoose = require('mongoose');

// MongoDB connexion
mongoose.connect('mongodb://localhost:27017/E-Commune')
.then(() => {
    console.log('MongoDB connected');
})
.catch((err) => {
    console.error('MongoDB connection error:', err);
});

module.exports = mongoose;