import express from 'express'
import { E_ERROR } from 'src/constants/errorTypes'
import makeResponse from 'src/helper/response'

type ErrorCode = keyof typeof E_ERROR

interface CustomErrorMessage {
  message: string
  status: number
}

type ErrorHandlerParam = ErrorCode | Error | CustomErrorMessage

const isHandledError = ( code: string ): code is ErrorCode => {
  return code as ErrorCode in E_ERROR
}

const isErrorInstance = ( err: Error ): err is Error => {
  return err instanceof Error
}

const isCustomError = ( err: CustomErrorMessage ): err is CustomErrorMessage => {
  return err !== undefined
}

const errorHandleMiddleware = ( err: ErrorHandlerParam, req: express.Request, res: express.Response, next: express.NextFunction ) => {
  if ( isHandledError( err as string ) ) {
    const code = err as keyof typeof E_ERROR
    const error = E_ERROR[code]
    const response = makeResponse.error(
      {
        type     : code,
        stat_msg : error.message,
        stat_code: error.status
      }
    )
    next( response )
  } else if ( isErrorInstance( err as Error ) ) {
    const error = err as Error
    const response = makeResponse.error( {
      type     : 'E_NativeError',
      stat_msg : error.message,
      stat_code: 500,
      stack    : error.stack ?? 'no stack defined'
    } )
    next( response )
  } else if ( isCustomError( err as CustomErrorMessage ) ) {
    const error = err as CustomErrorMessage
    const response = makeResponse.error( {
      type     : 'E_CustomError',
      stat_msg : error.message,
      stat_code: error.status
    } )
    next( response )
  } else {
    const response = makeResponse.error( {
      type     : 'E_UnhandledError',
      stat_msg : 'Something went wrong',
      stat_code: 500
    } )
    next( response )
  }
}

export default errorHandleMiddleware
