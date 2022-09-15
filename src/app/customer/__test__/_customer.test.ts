import { E_ERROR } from 'src/constants/errorTypes'
import { makeRequest } from 'src/helper/testHelper'
import { loginWithAdmin, shouldHaveError } from 'src/testHelper'
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

  describe( ' Get Customer By Id Endpoint ', () => {
    describe( '[-] Negative Test', () => {
      it( 'GET /customer/detail/:id with invalid id', async () => {
        await makeRequest.get( '/customer/detail/100' )
          .set( { authorization: token } )
          .expect( 200 )
          .then( res => {
            shouldHaveError( res.body.response, E_ERROR.CUSTOMER_NOT_FOUND )
          } )
      } )
    } )
    describe( '[+] Positive Test', () => {
      it( 'GET /customer/detail/:id with valid id', async () => {
        const res = await makeRequest.get( `/customer/detail/${customerMockData[0].id}` )
          .set( { authorization: token } )
        const data: any = res.body.data
        expect( data ).toHaveProperty( 'id', customerMockData[0].id )
        expect( data ).toHaveProperty( 'name', customerMockData[0].name )
        expect( data ).toHaveProperty( 'contact_number', customerMockData[0].contact_number )
        expect( data ).toHaveProperty( 'created_at' )
        expect( data ).toHaveProperty( 'updated_at' )
        expect( data ).toHaveProperty( 'transactions' )
        expect( data ).toHaveProperty( 'monetary' )
        expect( res.body.stat_code ).toBe( 200 )
      } )
    } )
  } )
} )
