import config from "config";
import { Sequelize } from "sequelize-typescript";

import LoggerInstance from "@util/logger";

import DatabaseConfig from "DatabaseConfig";
import { Logger } from "winston";

const dbConfig: DatabaseConfig = config.get("database");

let database;

try {
  database = new Sequelize({
    database: dbConfig.name,
    dialect: dbConfig.engine,
    host: dbConfig.host,
    logging: (msg: string): Logger => LoggerInstance.log("debug", "[POSTGRES]", { msg }),
    models: [__dirname + "/models/*"],
    password: dbConfig.password,
    pool: {
      idle: dbConfig.maxIdleTime,
      max: dbConfig.maxConnections,
      min: dbConfig.minConnections,
    },
    port: dbConfig.port,
    timezone: "+02:00",
    username: dbConfig.user,
  });
} catch (err) {
  LoggerInstance.log("error", "Error during creating OAUTH DB Instance", {
    err,
  });
}

export default database;
