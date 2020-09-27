import { Dialect } from "sequelize";

export default interface DatabaseConfig {
  engine: Dialect;
  host: string;
  maxIdleTime: number;
  maxConnections: number;
  minConnections: number;
  name: string;
  password: string;
  port: number;
  user: string;
}
