require('dotenv').config({ path: 'config/config.env' });
const mongoose = require("mongoose");
const color = require("colors");

const connectDB = async () => {  
  try {
    
    const mongoURI = process.env.NODE_ENV === "development"
      ? process.env.MONGO_DEV_URI
      : process.env.MONGO_PROD_URI;

    mongoose.connect(process.env.MONGO_DEV_URI, {
      dbName: "workflow_forms",
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    const db = mongoose.connection;
    db.on('error', 
      console.error.bind(console, 'MongoDB connection error:')
    );
    db.once('open', 
      () => {
        console.log(
          `MongoDB Connected ${db.host}`.cyan.underline.bold
        );
      }
    );
  } catch (err) {
    console.log(`Error: ${err.message}`.red);
    process.exit(1);
  }
}

module.exports = connectDB;