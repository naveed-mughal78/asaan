const fs = require("fs");
const { MongoClient } = require("mongodb");
const CommonDebugLoggerInstance = require("../../common/utils/logger/logger");
const path = require("path");
const config = require("config");

let fileData = path.join(__dirname, "../default.json");
const user = config.get("db.user");
const password = config.get("db.password");
const databaseName = config.get("db.databaseName");
const dbcollectionName = config.get("db.collectionName");
const coexistenceCollectionName = config.get("db.coexistenceCollectionName");

const mongoURI = `mongodb://${user}:${password}@10.200.68.168:27017`;

const dbName = databaseName;

const collectionName = dbcollectionName;

const logger = CommonDebugLoggerInstance.CommonDebugLogger("mongoDb.js");

function readJSONFile(fileData) {
  try {
    const jsonString = fs.readFileSync(fileData);
    logger.info("Read mongodb data succesfully", "mongoDb.js");
    return JSON.parse(jsonString);
  } catch (error) {
    logger.trace(error, "read file from mongodb got error");

    logger.error(error, "read file from mongodb got error");
    return null;
  }
}

function writeJSONFile(fileData, data) {
  fs.writeFileSync(fileData, JSON.stringify(data));
}

async function fetchDataFromMongoDB() {
  const client = new MongoClient(mongoURI);
  try {
    await client.connect();
    const db = client.db(dbName);
    console.log("Database connected successfully");
    logger.info("Database connected successfully", "mongoDb.js");

    logger.trace("Database connected successfully", "mongoDb.js");

    const collection = db.collection(collectionName);
    const data = await collection.findOne();

    const configurationCollection = db.collection(coexistenceCollectionName);
    const configData = await configurationCollection.findOne();

    return { ...data, ...configData };
  } catch (error) {
    setTimeout(async () => {
      await client.connect();
    }, 5000);

    logger.trace(error, "db connection error");

    logger.error(error, "db connection error");
  }
}

const checkAndUpdateData = async () => {
  try {
    const existingData = readJSONFile(`${fileData}`);
    const databaseData = await fetchDataFromMongoDB();
    if (!existingData) {
      writeJSONFile(fileData, databaseData);
    } else {
      if (JSON.stringify(existingData) !== JSON.stringify(databaseData)) {
        writeJSONFile(fileData, databaseData);
        writeJSONFile(fileData, databaseData);
        logger.info("File updated with database data.", "mongoDb.js");
      } else {
        logger.info("Data in file matches database.", "mongoDb.js");
      }
    }
  } catch (error) {
    logger.info(error, "mongoDb.js");
  }
};

module.exports = checkAndUpdateData;
