import mongoose from 'mongoose';

// Caching to avoid multiple connections in a serverless environment
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable');
}

// Global variable to store the MongoDB connection (caching)
let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

const connectMongoDB = async () => {
    if (cached.conn) {
        // Return cached connection
        return cached.conn;
    }

    if (!cached.promise) {
        // Create a new connection promise
        cached.promise = mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
            .then((mongoose) => {
                console.log('Connected to Database');
                return mongoose;
            })
            .catch((error) => {
                console.error('MongoDB connection error:', error);
                throw error; // Throw to indicate connection failure
            });
    }

    // Return the promise for awaiting
    cached.conn = await cached.promise;
    return cached.conn;
};

export default connectMongoDB;