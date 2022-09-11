import { Customer } from '@entity/customer'
import { db } from 'src/app'

const customerSeeds = async () => {
  try {
    // eslint-disable-next-line no-console
    console.info( 'Seeding customer data' )
    const customer = [
      {
        name          : 'Customer 1',
        contact_number: '001'
      },
      {
        name          : 'Customer 2',
        contact_number: '002'
      },
      {
        name          : 'Customer 3',
        contact_number: '003'
      }
    ]
    
    await db.getConnection().getRepository( Customer )
      .insert( customer )
  } catch ( error: any ) {
    return error.message
  }
}

export default customerSeeds
