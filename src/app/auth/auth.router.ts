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
    if ( !payload.noInduk || !payload.password ) {
      return new Errors( E_ERROR.NIP_AND_PASSWORD_REQUIRED )
    }
    return await loginService( payload )
  }

  @Post( '/register' )
  public async register ( @Body() payload: RegisterRequestParameter ) {
    return await registerUserService( payload )
  }
}
