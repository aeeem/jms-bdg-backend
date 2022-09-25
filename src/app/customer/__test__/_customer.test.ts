import { E_ERROR } from 'src/constants/errorTypes'
import { makeRequest } from 'src/helper/testHelper'
import { loginWithAdmin, shouldHaveError } from 'src/testHelper'
import {
  customerData as customerMockData, newCustomerMock, validCustomerMock
} from './_customer.mock'

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

  describe( ' Create Customer Endpoint ', () => {
    describe( '[-] Negative Test', () => {
      it( 'POST /customer with invalid payload', async () => {
        await makeRequest.post( '/customer' )
          .set( { authorization: token } )
          .send( newCustomerMock )
          .expect( 422 )
          .then( res => {
            expect( res.body ).toHaveProperty( 'type', 'VALIDATION_ERROR' )
            expect( res.body ).toHaveProperty( 'stat_msg', 'Validation Failed' )
            expect( res.body ).toHaveProperty( 'stat_code', 422 )
            expect( res.body ).toHaveProperty( 'details' )
            expect( res.body.details['payload.contact_number'] ).toHaveProperty( 'message', 'invalid string value' )
          } )
      } )
    } )
    describe( '[+] Positive Test', () => {
      it( 'POST /customer with valid payload', async () => {
        const res = await makeRequest.post( '/customer' )
          .set( { authorization: token } )
          .send( validCustomerMock )
        const data: any = res.body.data
        expect( data ).toHaveProperty( 'id' )
        expect( data ).toHaveProperty( 'name', validCustomerMock.name )
        expect( data ).toHaveProperty( 'contact_number', validCustomerMock.contact_number )
        expect( data ).toHaveProperty( 'created_at' )
        expect( data ).toHaveProperty( 'updated_at' )
        expect( res.body.stat_code ).toBe( 200 )
      } )
    } )
  } )

  describe( ' Get customer by ID Endpoint ', () => {
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
    describe( '[+] Positive Test', () => {} )
  } )

  describe( ' Search customer by name', () => {
    describe( '[-] Negative Test', () => {} )
    describe( '[+] Positive Test', () => {} )
  } )

  describe( ' Update Customer Endpoint ', () => {
    describe( '[-] Negative Test', () => {} )
    describe( '[+] Positive Test', () => {} )
  } )

  describe( ' Delete Customer Endpoint ', () => {
    describe( '[-] Negative Test', () => {} )
    describe( '[+] Positive Test', () => {} )
  } )
} )
