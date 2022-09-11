import * as express from 'express'
import { verifyToken } from './helper/jwt'
import { User } from '@entity/user'
import { E_ERROR } from './constants/errorTypes'
import { Errors } from './errorHandler'

export async function expressAuthentication (
  request: express.Request,
  securityName: string,
  scopes?: string[]
): Promise<any> {
  try {
    if ( securityName === 'api_key' ) {
      const headerToken = request.headers.authorization
      let token: string = ''
      if ( ( headerToken != null ) ) {
        token = String( headerToken )
      }
      if ( token.length === 0 ) throw E_ERROR.NO_TOKEN_PROVIDED
      const decoded: any = await verifyToken( token )
      if ( decoded instanceof Error ) throw decoded
      const user = await User.findOne( {
        where    : { id: decoded.id },
        relations: ['role', 'role.scopes']
      } )
      if ( user == null ) {
        throw E_ERROR.USER_NOT_FOUND
      }
      const userScopes: any = user.role.scopes
      const userScopeKeys = Object.keys( userScopes )
        .filter( key => ![
          'id',
          'created_at',
          'updated_at'
        ].includes( key ) && userScopes[key] === true )
        .map( scope => ( scope.replace( /_/g, ':' ) ) )

      const isScopeValid = scopes?.every( scope => userScopeKeys.includes( scope ) )
      if ( !isScopeValid ) throw E_ERROR.USER_IS_NOT_AUTHORIZED
      return await new Promise( ( resolve, reject ) => {
        resolve( decoded )
      } )
    }
  } catch ( error: any ) {
    return await new Promise( ( resolve, reject ) => {
      reject( new Errors( error ) )
    } )
  }
}
