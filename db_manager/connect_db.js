const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect(process.env.DBURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('MongoDB connection error:', err);
});

module.exports = { mongoose }