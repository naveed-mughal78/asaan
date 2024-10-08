const { Sequelize } = require("sequelize");
const config = require("config");
const logger = require("../../common/utils/logger/logger").CommonDebugLogger(
  "sequelize.js"
);

const connectSequelize = async () => {
  const dbType = config.get("db.type");
  const dbConfig = config.get(`db.${dbType}`);
  const sequelize = new Sequelize(
    dbConfig.database,
    dbConfig.username,
    dbConfig.password,
    {
      host: dbConfig.host,
      port: dbConfig.port,
      dialect: dbConfig.dialect,
    }
  );
  await sequelize.authenticate();
  logger.info(`${dbType} connected successfully`);
  return sequelize;
};

const fetchDataFromSequelize = async (sequelize) => {
  const dbType = config.get("db.type");
  const table = config.get(`db.${dbType}.table`);
  const [result] = await sequelize.query(
    `SELECT * FROM ${table} where data->>'apiName' = '${config.get(
      "apiName"
    )}' LIMIT 1`,
    {
      type: Sequelize.QueryTypes.SELECT,
    }
  );
  return result.data;
};

module.exports = { connectSequelize, fetchDataFromSequelize };
