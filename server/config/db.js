const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/visapath_demo';
  
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: Number(process.env.MONGODB_SERVER_SELECTION_TIMEOUT_MS) || 10000,
      maxPoolSize: Number(process.env.MONGODB_MAX_POOL_SIZE) || 10,
    });
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error('[Database Error] Failed to connect to MongoDB:', error.message);
    console.error('[Database Error] Check that MongoDB is running and MONGODB_URI is configured.');
    throw error;
  }
};

module.exports = connectDB;
