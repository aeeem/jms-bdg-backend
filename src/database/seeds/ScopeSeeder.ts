import { Scope } from '@entity/scopes'
import { db } from 'src/app'

const scopeSeeds = async () => {
  try {
    // eslint-disable-next-line no-console
    console.info( 'Seeding Scope data' )
    const scopes = {
      // customer
      create_customer   : true,
      read_customer     : true,
      update_customer   : true,
      delete_customer   : true,
      // product
      create_product    : true,
      read_product      : true,
      update_product    : true,
      delete_product    : true,
      // pegawai
      create_pegawai    : true,
      read_pegawai      : true,
      update_pegawai    : true,
      delete_pegawai    : true,
      // role
      create_role       : true,
      read_role         : true,
      update_role       : true,
      delete_role       : true,
      // scope
      create_scope      : true,
      read_scope        : true,
      update_scope      : true,
      delete_scope      : true,
      // user
      create_user       : true,
      read_user         : true,
      update_user       : true,
      delete_user       : true,
      // transaction
      create_transaction: true,
      read_transaction  : true,
      update_transaction: true,
      delete_transaction: true,
      // stock
      create_stock      : true,
      read_stock        : true,
      update_stock      : true,
      delete_stock      : true,
      // vendor
      create_vendor     : true,
      read_vendor       : true,
      update_vendor     : true,
      delete_vendor     : true
    }

    await db.getConnection().getRepository( Scope )
      .insert( scopes )
  } catch ( error: any ) {
    return error.message
  }
}

export default scopeSeeds
