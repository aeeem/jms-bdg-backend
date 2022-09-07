// import initialSeeds from "../../database/seeds/seeder/initialSeeds";
import { makeRequest } from '../../helper/testHelper'

describe( 'Auth module negative tests', () => {
  test( 'POST /login with empty payload', async () => {
    await makeRequest.post( '/auth/login' )
      .send( {
        noInduk : '',
        password: ''
      } )
      .expect( 200 )
      .then( res => {
        expect( res ).toBe( 200 )
      } )
  } )
} )
