const mongoose = require('mongoose');
// const config = require('config');
require('dotenv').config();
const db = process.env.MONGO_URI;

const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false
    });

    console.log('MongoDB connected...');
  } catch(err) {
    console.error(err.message);
    // Exit process with failure
    process.exit(1);
  }
}

module.exports = connectDB;