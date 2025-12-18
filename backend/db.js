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
    await setupTTLIndex();
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
}

const setupTTLIndex = async () => {
    const collectionName = "messages"; 
    const ttlField = "createdAt";
    const ttlInSeconds = 60 * 60; 
  
  const collection = mongoose.connection.collection(collectionName);
  await collection.createIndex({ [ttlField]: 1 }, { expireAfterSeconds: ttlInSeconds });
  console.log(`TTL index created on collection "${collectionName}" for field "${ttlField}"`);
  };

module.exports=ConnectToMongo;