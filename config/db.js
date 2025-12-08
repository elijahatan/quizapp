const mongoose = require('mongoose');

const uri = process.env.ATLAS_URI || process.env.MONGO_URI || process.env.atlas_uri;

async function connectDB() {
    try {
        if (!uri) {
            console.error('No MongoDB connection string found in ATLAS_URI or MONGO_URI');
            process.exit(1);
        }

        await mongoose.connect(uri);

        console.log('Connected to MongoDB Atlas');
    } catch (err) {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    }
}

module.exports = connectDB;


