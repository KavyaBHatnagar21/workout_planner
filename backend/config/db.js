const mongoose = require('mongoose');

const connectDB = () => {
    const db = process.env.MONGODB_URI;

    if (!db) {
        throw new Error('MongoDB URI not found');
    }

    return mongoose.connect(db)
};

module.exports = connectDB;