import { User } from '@entity/user'
import { db } from 'src/app'
import { createHashPassword } from 'src/helper/bcrypt'

const userSeeds = async () => {
  try {
    // eslint-disable-next-line no-console
    console.info( 'Seeding User data' )

    const pass: any = await createHashPassword( '123123' )
    const Users =
      {
        name    : 'Super Admin',
        password: pass,
        noInduk : '123',
        role_id : 1
      }
    await db.getConnection().getRepository( User )
      .insert( Users )
    return Users
  } catch ( error ) {
    return ''
  }
}

export default userSeeds
