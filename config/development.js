module.exports = {
  database: {
    engine: "postgres",
    host: "127.0.0.1",
    maxConnections: 25,
    maxIdleTime: 30000,
    minConnections: 0,
    name: "",
    password: "",
    port: "",
    user: "",
  },
  redis: {
    host: "127.0.0.1",
    port: 6379,
  },
  oauth: {
    port: 5000,
    debug: true,
    cookieSecret: "sjkdhf g,jhsd fgjs dfjgh sdjf",
    dsn: "",
  },
  sendgrid: {
    key: "",
  },
};
