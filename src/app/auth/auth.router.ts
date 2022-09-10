import { E_ERROR } from 'src/constants/errorTypes'
import { Errors } from 'src/errorHandler'
import {
  Body, Post, Route, Tags
} from 'tsoa'
import { LoginRequestParameter, RegisterRequestParameter } from './auth.interface'
import { loginService, registerUserService } from './auth.service'

@Tags( 'Authorization' )
@Route( '/api/auth' )
export class AuthController {
  @Post( '/login' )
  public async login ( @Body() payload: LoginRequestParameter ) {
    try {
      if ( !payload.noInduk || !payload.password ) {
        throw new Errors( E_ERROR.NIP_AND_PASSWORD_REQUIRED )
      }
      return await loginService( payload )
    } catch ( error ) {
      return error
    }
  }

  @Post( '/register' )
  public async register ( @Body() payload: RegisterRequestParameter ) {
    try {
      if ( !payload.noInduk || !payload.password || !payload.name ) {
        throw new Errors( E_ERROR.REGISTER_INVALID_PAYLOAD )
      }
      return await registerUserService( payload )
    } catch ( error ) {
      return error
    }
  }
}
