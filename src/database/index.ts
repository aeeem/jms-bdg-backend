/* eslint-disable no-console */
import { Connection, createConnection } from 'typeorm'
import dotenv from 'dotenv'
import doSeeding from './seeds'
import { StockGudangSubscriber } from './subscriber/stockGudang'
import { StockTokoSubscriber } from './subscriber/stockToko'
import { TransactionsSubscriber } from './subscriber/transactions'
import { Pool } from 'pg'

dotenv.config( {} )
export default class Database {
  public connection: Connection

  public async connectToDB (): Promise<void> {
    const pg = new Pool( { connectionTimeoutMillis: 2000 } )
    await createConnection( {
      type       : 'postgres',
      host       : 'localhost',
      port       : Number( process.env.DEV_DATABASE_PORT ) ?? 5432,
      username   : process.env.DEV_DATABASE_USERNAME,
      password   : process.env.DEV_DATABASE_PASSWORD,
      database   : process.env.DEV_DATABASE_NAME,
      entities   : [__dirname + '/entity/*.ts', __dirname + '/entity/*.js'],
      logging    : true,
      synchronize: true,
      logger     : 'advanced-console',
      extra      : {
        max                    : 20,
        allowExitOnIdle        : true,
        idleTimeoutMillis      : 2000,
        connectionTimeoutMillis: 2000
      }
      // subscribers: [
      //   StockGudangSubscriber,
      //   StockTokoSubscriber,
      //   TransactionsSubscriber
      // ]
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
      port       : Number( process.env.TEST_DATABASE_PORT ) ?? 5432,
      username   : process.env.TEST_DATABASE_USERNAME,
      password   : process.env.TEST_DATABASE_PASSWORD,
      database   : process.env.TEST_DATABASE_NAME,
      entities   : [__dirname + '/entity/*.ts', __dirname + '/entity/*.js'],
      dropSchema : true,
      synchronize: true,
      logging    : true
      // subscribers: [
      //   StockGudangSubscriber,
      //   StockTokoSubscriber,
      //   TransactionsSubscriber
      // ]

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
