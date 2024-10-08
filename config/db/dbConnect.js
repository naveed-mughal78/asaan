const config = require("config");
const mongooseModule = require("./mongoose");
const sequelizeModule = require("./sequelize");
const logger = require("../../common/utils/logger/logger").CommonDebugLogger(
  "dbConnect.js"
);

let dbClient;

const connectDB = async () => {
  const dbType = config.get("db.type");
  if (dbType === "mongodb") {
    dbClient = await mongooseModule.connectMongoose();
  } else {
    dbClient = await sequelizeModule.connectSequelize();
  }
};

const fetchData = async () => {
  const dbType = config.get("db.type");
  if (dbType === "mongodb") {
    return await mongooseModule.fetchDataFromMongoDB();
  } else {
    return await sequelizeModule.fetchDataFromSequelize(dbClient);
  }
};

module.exports = { connectDB, fetchData };
