const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`⚠️ MongoDB Connection Error: ${error.message}`);
    console.error(`Please ensure MongoDB is running locally (e.g. 'mongod' or MongoDB Service) or update MONGO_URI in backend/.env`);
  }
};

module.exports = connectDB;
