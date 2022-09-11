import { makeRequest } from 'src/helper/testHelper'
import { loginWithAdmin } from 'src/testHelper'
import { customerData as customerMockData } from './_customer.mock'

let token = ''

describe( 'Customer module Tests', () => {
  beforeAll( async () => {
    token = await loginWithAdmin()
  } )

  describe( 'Get All Customer Endpoint ', () => {
    it( '[GET] /customer should return all customer', async () => {
      const res = await makeRequest.get( '/customer' )
        .set( { authorization: token } )
      const data: any[] = res.body.data
      data.forEach( ( customer, index ) => {
        expect( customer ).toHaveProperty( 'id', customerMockData[index].id )
        expect( customer ).toHaveProperty( 'name', customerMockData[index].name )
        expect( customer ).toHaveProperty( 'contact_number', customerMockData[index].contact_number )
        expect( customer ).toHaveProperty( 'created_at' )
        expect( customer ).toHaveProperty( 'updated_at' )
        expect( customer ).toHaveProperty( 'transactions' )
        expect( customer ).toHaveProperty( 'monetary' )
      } )
      expect( res.body.stat_code ).toBe( 200 )
    } )
  } )
} )
