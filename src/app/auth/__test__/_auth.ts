// import initialSeeds from "../../database/seeds/seeder/initialSeeds";
import { E_ERROR } from 'src/constants/errorTypes'
import { SUCCESS_MESSAGE } from 'src/constants/languageEnums'
import { shouldHaveError } from 'src/testHelper'
import { makeRequest } from '../../../helper/testHelper'
import { LoginPayloadMock, RegisterPayloadMock } from './_auth.mock'

describe( 'Auth modul tests', () => {
  describe( 'Login Endpoint', () => {
    describe( '[-] Negative Test', () => {
      it( 'POST /login with empty payload', async () => {
        await makeRequest.post( '/auth/login' )
          .send( LoginPayloadMock.emptyNipAndPassword )
          .expect( 200 )
          .then( res => {
            shouldHaveError( res.body.response, E_ERROR.NIP_AND_PASSWORD_REQUIRED )
          } )
      } )
    
      it( 'POST /login with wrong noInduk', async () => {
        await makeRequest.post( '/auth/login' )
          .send( LoginPayloadMock.wrongNip )
          .expect( 200 )
          .then( res => {
            shouldHaveError( res.body.response, E_ERROR.LOGIN_WRONG_NIP )
          } )
      } )
    
      it( 'POST /login with wrong password', async () => {
        await makeRequest.post( '/auth/login' )
          .send( LoginPayloadMock.wrongPassword )
          .expect( 200 )
          .then( res => {
            shouldHaveError( res.body.response, E_ERROR.LOGIN_WRONG_PASSWORD )
          } )
      } )
    } )
    describe( '[+] Positive Test', () => {
      it( 'POST /login with super admin user', async () => {
        await makeRequest.post( '/auth/login' )
          .send( LoginPayloadMock.superAdmin )
          .expect( 200 )
          .then( ( { body:response } ) => {
            expect( response ).toHaveProperty( 'data' )
            expect( response ).toHaveProperty( 'stat_code' )
            expect( response ).toHaveProperty( 'stat_msg' )
            expect( response.stat_msg ).toBe( SUCCESS_MESSAGE.LOGIN_SUCCESS )
          } )
      } )
    } )
  } )

  describe( 'Register user', () => {
    describe( '[-] Negative Test', () => {
      it( 'POST /register with empty payload', async () => {
        await makeRequest.post( '/auth/register' )
          .send( RegisterPayloadMock.emptyStringsValidation )
          .expect( 200 )
          .then( res => {
            shouldHaveError( res.body.response, E_ERROR.REGISTER_INVALID_PAYLOAD )
          } )
      } )
      it( 'POST /register with Existing user (super admin)', async () => {
        await makeRequest.post( '/auth/register' )
          .send( RegisterPayloadMock.existingUser )
          .expect( 200 )
          .then( res => {
            shouldHaveError( res.body.response, E_ERROR.USER_EXISTS )
          } )
      } )
    } )
    describe( '[+] Positive Test', () => {
      it( 'POST /register with new user', async () => {
        await makeRequest.post( '/auth/register' )
          .send( RegisterPayloadMock.newRandomUser )
          .expect( 200 )
          .then( ( { body } ) => {
            expect( body ).toHaveProperty( 'stat_code', 200 )
            expect( body ).toHaveProperty( 'stat_msg', SUCCESS_MESSAGE.REGISTER_SUCCESS )
            // check payload
            expect( body.data ).toHaveProperty( 'noInduk', RegisterPayloadMock.newRandomUser.noInduk )
            expect( body.data ).toHaveProperty( 'name', RegisterPayloadMock.newRandomUser.name )
            expect( body.data ).toHaveProperty( 'role_id', null )
          } )
      } )
    } )
  } )
} )
