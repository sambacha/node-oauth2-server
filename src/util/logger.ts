import config from "config";
import winston from "winston";
import Sentry from "winston-sentry-raven-transport";

const { combine, timestamp, prettyPrint } = winston.format;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const transports: any = [
  new winston.transports.Console({
    level: config.get("oauth.debug") ? "debug" : "info",
  }),
];

if (!config.get("oauth.debug")) {
  transports.push(
    new Sentry({
      level: "warn",
      dsn: config.get("oauth.dsn"),
      patchGlobal: true,
    }),
  );
}

const logger = winston.createLogger({
  format: combine(timestamp(), prettyPrint()),
  transports,
});

if (config.get("oauth.debug")) {
  logger.log("debug", "Logging initialized at debug level");
}

export default logger;
