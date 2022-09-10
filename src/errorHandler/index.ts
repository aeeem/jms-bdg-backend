import {
  CustomErrorMessage, ErrorKeys, ErrorMessages, ErrorTypes, E_ERROR
} from 'src/constants/errorTypes'
import { ErrorResponseType } from 'src/helper/response'

export class Errors extends Error {
  public type: string
  public status: number
  public response: ErrorResponseType<any>
  constructor ( err: ErrorTypes ) {
    super()
    // this.errorTypeParser()
    this.errorParser( err )
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
    if ( this.isHandledError( err ) ) {
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

    // getEnumKeyByEnumValue<
    //   TEnumKey extends string,
    //   TEnumVal extends string | number
    // >( myEnum: { [ key in TEnumKey ]: TEnumVal }, enumValue: TEnumVal ): string {
    //   const keys = ( Object.keys( myEnum ) as TEnumKey[] ).filter(
    //     x => myEnum[x] === enumValue
    //   )
    //   return keys.length > 0 ? keys[0] : ''
    // }

    // errorTypeParser () {
    //   switch ( this.err ) {
    //     case E_ErrorType.E_FORBIDDEN_ROLE_INPUT:
    //       this.type = this.getEnumKeyByEnumValue( E_ErrorType, this.err )
    //       this.message = E_ErrorType.E_FORBIDDEN_ROLE_INPUT
    //       this.status = HTTP_CODE.NOT_FOUND
    //       break
    //     case E_ErrorType.E_ROLE_NOT_FOUND:
    //       this.type = this.getEnumKeyByEnumValue( E_ErrorType, this.err )
    //       this.message = E_ErrorType.E_ROLE_NOT_FOUND
    //       this.status = HTTP_CODE.NOT_FOUND
    //       break
    //     case E_ErrorType.E_EMPLOYEE_NOT_FOUND:
    //       this.type = this.getEnumKeyByEnumValue( E_ErrorType, this.err )
    //       this.message = E_ErrorType.E_EMPLOYEE_NOT_FOUND
    //       this.status = HTTP_CODE.NOT_FOUND
    //       break
    //     case E_ErrorType.E_EXPECTED_TOTAL_PRICE_NOT_MATCH:
    //       this.type = this.getEnumKeyByEnumValue( E_ErrorType, this.err )
    //       this.message = E_ErrorType.E_EXPECTED_TOTAL_PRICE_NOT_MATCH
    //       this.status = HTTP_CODE.BAD_REQUEST
    //       break
    //     case E_ErrorType.E_PRODUCT_NOT_FOUND:
    //       this.type = E_ErrorType.E_NOT_FOUND
    //       this.message = E_ErrorType.E_PRODUCT_NOT_FOUND
    //       this.status = HTTP_CODE.INTERNAL_SERVER_ERROR
    //       break

    //     case E_ErrorType.E_USER_EXISTS:
    //       this.type = this.getEnumKeyByEnumValue( E_ErrorType, this.err )
    //       this.message = E_ErrorType.E_USER_EXISTS
    //       this.status = HTTP_CODE.INTERNAL_SERVER_ERROR
    //       break

    //     case E_ErrorType.E_LOGIN_WRONG_PASSWORD:
    //       this.type = this.getEnumKeyByEnumValue( E_ErrorType, this.err )
    //       this.message = E_ErrorType.E_LOGIN_WRONG_PASSWORD
    //       this.status = HTTP_CODE.UNAUTHORIZED
    //       break

    //     case E_ErrorType.E_LOGIN_WRONG_NIP:
    //       this.type = this.getEnumKeyByEnumValue( E_ErrorType, this.err )
    //       this.message = E_ErrorType.E_LOGIN_WRONG_NIP
    //       this.status = HTTP_CODE.UNAUTHORIZED
    //       break

    //     case E_ErrorType.E_CUSTOMER_NOT_FOUND:
    //       this.type = this.getEnumKeyByEnumValue( E_ErrorType, this.err )
    //       this.message = E_ErrorType.E_CUSTOMER_NOT_FOUND
    //       this.status = HTTP_CODE.INTERNAL_SERVER_ERROR
    //       break

    //     case E_ErrorType.E_VENDOR_NOT_FOUND:
    //       this.type = this.getEnumKeyByEnumValue( E_ErrorType, this.err )
    //       this.message = E_ErrorType.E_VENDOR_NOT_FOUND
    //       this.status = HTTP_CODE.INTERNAL_SERVER_ERROR
    //       break
    //     case E_ErrorType.E_TOKEN_EXPIRED:
    //       this.type = this.getEnumKeyByEnumValue( E_ErrorType, this.err )
    //       this.message = E_ErrorType.E_TOKEN_EXPIRED
    //       this.status = HTTP_CODE.UNAUTHORIZED
    //       break
    //     default:
    //       switch ( this.err.name ) {
    //         case 'QueryFailedError':
    //           this.handleDatabaseError( this.err )
    //           break
    //       }
    //       break
    //   }
    // }

  // handleDatabaseError ( name: any ) {
  //   switch ( name.code ) {
  //     case E_ErrorType.ER_DUP_ENTRY:
  //       this.type = E_ErrorType.ER_DUP_ENTRY
  //       this.message = this.err.message
  //       this.status = HTTP_CODE.INTERNAL_SERVER_ERROR
  //       break
  //     default:
  //       this.type = E_ErrorType.E_UNKNOWN_ERROR
  //       this.message = this.err.message
  //       this.status = HTTP_CODE.INTERNAL_SERVER_ERROR
  //       console.error( this.err.stack )
  //       break
  //   }
  }
}
