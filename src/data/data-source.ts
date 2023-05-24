import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "../entities/User"
import { Blog } from "../entities/Blog";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "admin",
  database: "test_welbex",
  synchronize: true,
  logging: false,
  entities: [User, Blog],
  migrations: [],
  subscribers: [],
});
