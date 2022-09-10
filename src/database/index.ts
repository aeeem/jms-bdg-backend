/* eslint-disable n/no-path-concat */
/* eslint-disable no-console */
import { Connection, createConnection } from 'typeorm'
import dotenv from 'dotenv'
import doSeeding from './seeds'

dotenv.config( {} )
export default class Database {
  public connection: Connection

  public async connectToDB (): Promise<void> {
    await createConnection( {
      type       : 'postgres',
      host       : 'localhost',
      port       : 5432,
      username   : process.env.DEV_DATABASE_USERNAME,
      password   : process.env.DEV_DATABASE_PASSWORD,
      database   : process.env.DEV_DATABASE_NAME,
      entities   : [__dirname + '/entity/*.ts', __dirname + '/entity/*.js'],
      logging    : false,
      synchronize: true
    } ).then( _con => {
      this.connection = _con
      console.log( 'Connected to db!!' )
    } )
      .catch( console.error )
  }

  public async connectToDBTest (): Promise<void> {
    await createConnection( {
      type       : 'postgres',
      host       : 'localhost',
      port       : 5432,
      username   : process.env.TEST_DATABASE_USERNAME,
      password   : process.env.TEST_DATABASE_PASSWORD,
      database   : process.env.TEST_DATABASE_NAME,
      entities   : [__dirname + '/entity/*.ts', __dirname + '/entity/*.js'],
      dropSchema : true,
      synchronize: true,
      logging    : false
    } ).then( async _con => {
      this.connection = _con
      console.log( 'Connected to db!!' )
      await this.reseedTestData()
    } )
      .catch( console.error )
  }

  async reseedTestData () {
    try {
      await doSeeding()
    } catch ( error ) {
      console.error( error )
    }
  }

  public getConnection (): Connection {
    return this.connection
  }

  public async closeConnection (): Promise<void> {
    await this.connection.close()
  }

  public queryRunner () {
    return this.connection.createQueryRunner()
  }
}
