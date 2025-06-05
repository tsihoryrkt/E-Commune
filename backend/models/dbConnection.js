const mongoose = require('mongoose');

// MongoDB connexion
const dbURI = process.env.MONGO_URI || 'mongodb://localhost:27017/E-Commune';

mongoose.connect(dbURI)
.then(() => {
    console.log('MongoDB connected to', dbURI);
})
.catch((err) => {
    console.error('MongoDB connection error:', err, '(URI:', dbURI, ')');
});

module.exports = mongoose;