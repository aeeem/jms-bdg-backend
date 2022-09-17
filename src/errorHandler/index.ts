import {
  CustomErrorMessage, ErrorKeys, ErrorMessages, ErrorTypes, E_ERROR
} from 'src/constants/errorTypes'
import { ErrorResponseType } from 'src/helper/response'
import { ValidateError } from 'tsoa'

export class Errors extends Error {
  public type: string
  public status: number
  public response: ErrorResponseType<any>
  public stat_msg: string | object
  public stat_code: number
  public details: unknown
  constructor ( err: ErrorTypes ) {
    super()
    // this.errorTypeParser()
    const error = this.errorParser( err )
    this.type = error.type
    this.stat_msg = error.stat_msg ?? 'Internal Server Error'
    this.stat_code = error.stat_code as number
  }

  isHandledError = ( code: ErrorMessages ) => {
    const keys = Object.keys( E_ERROR ) as ErrorKeys[]
    return keys.some( key => E_ERROR[key] === code )
  }

  isErrorInstance = ( err: Error ): err is Error => {
    return err instanceof Error
  }

  isCustomError = ( err: CustomErrorMessage ): err is CustomErrorMessage => {
    return err !== undefined
  }

  getErrorType = ( code: ErrorMessages ) => {
    const keys = Object.keys( E_ERROR ) as ErrorKeys[]
    const errType = keys.find( key => E_ERROR[key] === code )
    return errType
  }

  unhandledError = () => {
    this.response = {
      type     : 'E_UnhandledError',
      stat_msg : 'Something went wrong',
      stat_code: 500
    }
  }

  errorParser = ( err: any ) => {
    if ( err instanceof ValidateError ) {
      this.response = {
        type     : 'VALIDATION_ERROR',
        stat_msg : 'Validation Failed',
        stat_code: 422,
        details  : err.fields
      }
    } else if ( this.isHandledError( err ) ) {
      const type = this.getErrorType( err )
      const error = err as ErrorMessages
      this.response =
        {
          type,
          stat_msg : error.message,
          stat_code: error.status
        }
    } else if ( this.isErrorInstance( err as Error ) ) {
      const error = err as Error
      this.response = {
        type     : 'E_NativeError',
        stat_msg : error.message,
        stat_code: 500,
        stack    : error.stack ?? 'no stack defined'
      }
    } else if ( this.isCustomError( err as CustomErrorMessage ) ) {
      const error = err as CustomErrorMessage
      this.response = {
        type     : 'E_CustomError',
        stat_msg : error.message,
        stat_code: error.status
      }
    } else {
      // this.unhandledError()
    }

    return this.response
  }
}
