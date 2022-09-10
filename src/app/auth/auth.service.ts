import { User } from '@entity/user'
import { HTTP_CODE } from 'src/constants/enums'
import { E_ERROR } from 'src/constants/errorTypes'
import { SUCCESS_MESSAGE } from 'src/constants/languageEnums'
import { Errors } from 'src/errorHandler'
import { compareHash, createHashPassword } from 'src/helper/bcrypt'
import { createToken } from 'src/helper/jwt'
import makeResponse from 'src/helper/response'
import { scopeFormatter } from 'src/helper/scopeHelper'
import { LoginRequestParameter, RegisterRequestParameter } from './auth.interface'

/**
 * It will return a token and user data if the user is found and the password is correct
 * @param {LoginRequestParameter} payload - LoginRequestParameter
 * @returns - token
 *   - id
 *   - noInduk
 *   - name
 *   - role
 */
export const loginService = async ( payload: LoginRequestParameter ) => {
  try {
    const user = await User.findOne( {
      where    : { noInduk: payload.noInduk },
      relations: ['role', 'role.scopes']
    } )
    if ( user == null ) throw E_ERROR.LOGIN_WRONG_NIP

    const isPasswordMatch = await compareHash( payload.password, user.password )
    if ( !isPasswordMatch ) throw E_ERROR.LOGIN_WRONG_PASSWORD

    const userScope = scopeFormatter( user.role.scopes )

    const api_token = createToken( { id: user.id, noInduk: user.noInduk } )

    return makeResponse.success( {
      data: {
        token  : api_token,
        id     : user.id,
        noInduk: user.noInduk,
        name   : user.name,
        role   : user.role.role,
        scopes : userScope
      },
      stat_code: HTTP_CODE.OK,
      stat_msg : SUCCESS_MESSAGE.LOGIN_SUCCESS
    } )
  } catch ( e: any ) {
    return await Promise.reject( new Errors( e ) )
  }
}

/**
 * It will register a new user to the database
 * @param {RegisterRequestParameter} payload - RegisterRequestParameter
 * @returns - User
 *   - Error
 */
export const registerUserService = async ( payload: RegisterRequestParameter ) => {
  try {
    const user = await User.findOne( { where: { noInduk: payload.noInduk } } )
    if ( user != null ) throw E_ERROR.USER_EXISTS

    const hashedPassword = await createHashPassword( payload.password )

    if ( hashedPassword instanceof Error ) throw hashedPassword

    const newUser = new User()
    newUser.noInduk = payload.noInduk
    newUser.name = payload.name
    newUser.password = hashedPassword

    await newUser.save()

    return makeResponse.success<User>( {
      data     : newUser,
      stat_code: HTTP_CODE.OK,
      stat_msg : SUCCESS_MESSAGE.REGISTER_SUCCESS
    } )
  } catch ( e: any ) {
    return await Promise.reject( new Errors( e ) )
  }
}
