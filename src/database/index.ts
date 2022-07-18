import { Connection, createConnection, SimpleConsoleLogger } from "typeorm";
import dotenv from 'dotenv';
import { Product } from "@entity/product";

dotenv.config({});
class Database {

  public connection: Connection;

  constructor() {
    this.connectToDB();
  }

  private async connectToDB(): Promise<void> {
    await createConnection({
      type: envString("mysql", "mysql"),
      host: envString(process.env.DATABASE_HOST!, process.env.DEV_DATABASE_HOST!),
      port: envString(Number(process.env.DATABASE_PORT!), Number(process.env.DEV_DATABASE_PORT!)),
      username: envString(process.env.DATABASE_USERNAME!, process.env.DEV_DATABASE_USERNAME!),
      password: envString(process.env.DATABASE_PASSWORD!, process.env.DEV_DATABASE_PASSWORD!),
      database: envString(process.env.DATABASE_NAME!, process.env.DEV_DATABASE_NAME!),
      entities: [
        __dirname + "/entity/*.ts",
        __dirname + "/entity/*.js"
      ],
      synchronize: true,
      logging: false
    }).then(_con => {
      this.connection = _con;
      console.log("Connected to db!!");
    }).catch(console.error)
  }

}


function envString<T>(prodString: T, devString: T): T {
  return process.env.NODE_ENV === 'production' ? prodString : devString
}

export const db = new Database();