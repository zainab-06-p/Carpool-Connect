const mongoose = require('mongoose')
mongoose.set("strictQuery", false);
const mongoURI="mongodb://127.0.0.1:27017/ChatSystem"


const ConnectToMongo = async () => {
  try {
    await mongoose.connect(mongoURI);
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