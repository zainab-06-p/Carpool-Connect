const mongoose = require('mongoose')
mongoose.set("strictQuery", false);
const mongoURI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/ChatSystem"

// Connection options for better memory management
const options = {
  maxPoolSize: 10,
  minPoolSize: 2,
  socketTimeoutMS: 45000,
  serverSelectionTimeoutMS: 5000,
  family: 4
};

const ConnectToMongo = async () => {
  try {
    await mongoose.connect(mongoURI, options);
    console.log("Connected To MongoDB successfully");
    // TTL index removed to reduce memory usage
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
}

module.exports=ConnectToMongo;