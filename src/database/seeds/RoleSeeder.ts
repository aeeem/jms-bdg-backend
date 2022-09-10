import { Role } from '@entity/role'
import { db } from 'src/app'

const roleSeeds = async () => {
  // eslint-disable-next-line no-console
  console.info( 'Seeding Role data' )

  const role = {
    role    : 'Super Admin',
    scopesId: 1
  }
  await db.getConnection().getRepository( Role )
    .insert( role )
}

export default roleSeeds
