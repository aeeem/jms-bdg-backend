import customerSeeds from './CustomerSeeder'
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
    await customerSeeds()
    console.log( 'Seeding data finished' )
  } catch ( error ) {
    return error
  }
}

export default doSeeding
