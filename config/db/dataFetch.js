const fs = require("fs");
const path = require("path");
const config = require("config");
const { connectDB, fetchData } = require("./dbConnect");
const logger = require("../../common/utils/logger/logger").CommonDebugLogger(
  "dataFetch.js"
);

const fileData = path.join(__dirname, "../default.json");

function readJSONFile(filePath) {
  try {
    const jsonString = fs.readFileSync(filePath);
    logger.info("Read data successfully");
    return JSON.parse(jsonString);
  } catch (error) {
    logger.trace(error, "read file error");
    logger.error(error, "read file error");
    return null;
  }
}

function writeJSONFile(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

const checkAndUpdateData = async () => {
  try {
    await connectDB();
    const existingData = readJSONFile(fileData);
    const databaseData = await fetchData();
    if (!existingData) {
      writeJSONFile(fileData, databaseData);
    } else {
      if (JSON.stringify(existingData) !== JSON.stringify(databaseData)) {
        writeJSONFile(fileData, databaseData);
        logger.info("File updated with database data.");
      } else {
        logger.info("Data in file matches database.");
      }
    }
  } catch (error) {
    logger.error(error, "dataFetch.js error");
  }
};

module.exports = checkAndUpdateData;
