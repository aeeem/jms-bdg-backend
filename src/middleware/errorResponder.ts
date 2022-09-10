
import express from 'express'
import { E_ERROR } from 'src/constants/errorTypes'
import { Errors } from 'src/errorHandler'
import { ValidateError } from 'tsoa'

const errorResponder = ( err: unknown, req: express.Request, res: express.Response, next: express.NextFunction ) => {
  console.log( 'here' )
  if ( err instanceof ValidateError ) {
    // console.error( `Caught Validation Error for ${req.path}:`, err.fields )
    return res.status( 422 ).json( {
      type   : E_ERROR.VALIDATION_ERROR,
      message: 'Validation Failed',
      details: err?.fields
    } )
  }
  if ( err instanceof Errors ) {
    return res.status( err.status ?? 500 ).json( {
      type   : err.type,
      message: err.message
    } )
  }
  if ( err instanceof Error ) {
    console.log( 'here' )

    return res.status( 500 ).json( {
      
      errorName: err.name,
      message  : err.message,
      stack    : err.stack ?? 'no stack defined'
    } )
  }
  next()
}

export default errorResponder
