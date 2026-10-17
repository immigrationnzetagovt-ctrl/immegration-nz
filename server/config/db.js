const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/visapath_demo';
  
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error('[Database Error] Failed to connect to MongoDB:', error.message);
    console.error('[Database Error] Please ensure your local MongoDB daemon is running at', uri);
    // Explicitly fail rather than silently falling back to mock data
    throw error;
  }
};

module.exports = connectDB;
