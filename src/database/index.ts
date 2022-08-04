import { Connection, createConnection } from "typeorm";
import dotenv from 'dotenv';
import { createDatabase } from "typeorm-extension";

dotenv.config({});
export default class Database {

  public connection: Connection;

  public async connectToDB(): Promise<void> {
    await createConnection({
      type: envString("postgres", "postgres"),
      host: envString(process.env.DATABASE_HOST!, process.env.DEV_DATABASE_HOST!),
      port: envString(Number(process.env.DATABASE_PORT!), Number(process.env.DEV_DATABASE_PORT!)),
      username: envString(process.env.DATABASE_USERNAME!, process.env.DEV_DATABASE_USERNAME!),
      password: envString(process.env.DATABASE_PASSWORD!, process.env.DEV_DATABASE_PASSWORD!),
      database: envString(process.env.DATABASE_NAME!, process.env.DEV_DATABASE_NAME!),
      entities: [
        __dirname + "/entity/*.ts",
        __dirname + "/entity/*.js"
      ],
      logging: false,
      synchronize: true
    }).then(_con => {
      this.connection = _con;
      console.log("Connected to db!!");
    }).catch(console.error)
  }

  public async connectToDBTest(): Promise<void> {
    await createConnection({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: process.env.TEST_DATABASE_USERNAME,
      password: process.env.TEST_DATABASE_PASSWORD,
      database: process.env.TEST_DATABASE_NAME,
      entities: [
        __dirname + "/entity/*.ts",
        __dirname + "/entity/*.js"
      ],
      dropSchema: true,
      synchronize: true,
      logging: false
    }).then(_con => {
      this.connection = _con;
      console.log("Connected to db!!");
    }).catch(console.error)
  }

  public getConnection(): Connection {
    return this.connection;
  }

  public async closeConnection(): Promise<void> {
    await this.connection.close();
  }
}


function envString<T>(prodString: T, devString: T): T {
  return process.env.NODE_ENV === 'production' ? prodString : devString
}
