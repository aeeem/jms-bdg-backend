import { ErrorTypes } from 'src/constants/errorTypes'
import { Errors } from 'src/errorHandler'
import { ErrorResponseType, ResponseType } from 'src/helper/response'

export const shouldHaveError = ( response: ErrorResponseType<any>, expectedError: ErrorTypes ) => {
  const { response: err } = new Errors( expectedError )
  expect( response.type ).toBe( err.type )
  expect( response.stat_msg ).toBe( err.stat_msg )
  expect( response.stat_code ).toBe( err.stat_code )
}
export const shouldHaveSuccessResponse = <T = null>( response: ResponseType<T>, expectedResponse: ResponseType<T> ) => {
  expect( response.stat_code ).toBe( expectedResponse.stat_code )
  expect( response.stat_msg ).toBe( expectedResponse.stat_msg )
}
