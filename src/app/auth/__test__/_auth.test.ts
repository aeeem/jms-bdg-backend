// import initialSeeds from "../../database/seeds/seeder/initialSeeds";
import { E_ERROR } from 'src/constants/errorTypes'
import { SUCCESS_MESSAGE } from 'src/constants/languageEnums'
import { shouldHaveError } from 'src/testHelper'
import { makeRequest } from '../../../helper/testHelper'
import { LoginPayloadMock } from './_auth.mock'

describe( 'Auth module negative tests', () => {
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

  describe( 'register user', () => {
    describe( '[-] Negative Test', () => {} )
    describe( '[+] Positive Test', () => {} )
  } )
} )
