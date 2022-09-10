import roleSeeds from './RoleSeeder'
import scopeSeeds from './ScopeSeeder'
import userSeeds from './UserSeeder'

const doSeeding = async () => {
  try {
    // eslint-disable-next-line no-console
    console.log( 'Seeding data...' )
    await scopeSeeds()
    await roleSeeds()
    await userSeeds()
  } catch ( error ) {
    return error
  }
}

export default doSeeding
