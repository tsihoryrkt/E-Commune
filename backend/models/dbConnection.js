const mongoose = require('mongoose');

// MongoDB connexion
const dbURI = process.env.MONGO_URI;

if (!dbURI) {
  console.error('FATAL ERROR: MONGO_URI environment variable is not set.');
  process.exit(1);
}

mongoose.connect(dbURI)
.then(() => {
    console.log('MongoDB connected to', dbURI);
})
.catch((err) => {
    console.error('MongoDB connection error:', err, '(URI:', dbURI, ')');
});

module.exports = mongoose;