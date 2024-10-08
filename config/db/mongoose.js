const mongoose = require('mongoose');
const config = require('config');
const logger = require('../../common/utils/logger/logger').CommonDebugLogger("mongoDb.js");
 
const connectMongoose = async () => {
    try {
        const mongoURI = `mongodb://${config.get('db.mongodb.user')}:${config.get('db.mongodb.password')}@${config.get('db.mongodb.host')}:${config.get('db.mongodb.port')}/${config.get('db.mongodb.databaseName')}?authSource=admin`;
        // const mongoURI = `mongodb://${config.get('db.mongodb.host')}:${config.get('db.mongodb.port')}/${config.get('db.mongodb.databaseName')}`;
        await mongoose.connect(mongoURI);
 
        logger.info("MongoDB connected successfully");
    } catch (error) {
        logger.error("MongoDB connection error:", error);
        throw error;
    }
};
 
const fetchDataFromMongoDB = async () => {
    try {
        const collectionName = config.get('db.mongodb.collectionName');
        const collection = mongoose.connection.collection(collectionName);
        return await collection.findOne({ apiName: config.get('apiName') });
    } catch (error) {
        logger.error("Error fetching data from MongoDB:", error);
        throw error;
    }
};
 
module.exports = { connectMongoose, fetchDataFromMongoDB };
