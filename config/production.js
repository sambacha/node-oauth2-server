module.exports = {
  database: {
    engine: process.env.DATABASE_ENGINE || "postgres",
    host: process.env.DATABASE_HOST || "127.0.0.1",
    maxConnections: process.env.DATABASE_MAX_CONNECTIONS || 25,
    maxIdleTime: process.env.DATABASE_MAX_IDLE_TIME || 30000,
    minConnections: process.env.DATABASE_MIN_CONNECTIONS || 1,
    name: process.env.DATABASE_NAME,
    password: process.env.DATABASE_PASSWORD,
    port: process.env.DATABASE_PORT,
    user: process.env.DATABASE_USER,
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
  oauth: {
    port: 5000,
    debug: false,
    cookieSecret: process.env.OAUTH_COOKIE_SECRET,
    dsn: process.env.OAUTH_DSN,
  },
  sendgrid: {
    key: process.env.SENDGRID_KEY,
  },
};
