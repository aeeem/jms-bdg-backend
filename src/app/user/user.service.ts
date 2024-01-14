import { Role } from '@entity/role'
import { User } from '@entity/user'
import { Errors } from 'src/errorHandler'
import { scopeFormatter } from 'src/helper/scopeHelper'
import { ChangePasswordParameter, UpdateUserParameter } from './user.interfaces'
import { E_ERROR } from 'src/constants/errorTypes'
import { HTTP_CODE } from 'src/constants/enums'
import { SUCCESS_MESSAGE } from 'src/constants/languageEnums'
import makeResponse from 'src/helper/response'
import { createHashPassword } from 'src/helper/bcrypt'

export const getAllUserService = async () => {
  try {
    const users = await User.find( { relations: ['role', 'role.scopes'] } )
    const formattedUsers = users.map( user => {
      const scopes = scopeFormatter( user.role.scopes )
      return {
        id     : user.id,
        noInduk: user.noInduk,
        name   : user.name,
        role   : user.role.role,
        scopes
      }
    } )
    return formattedUsers
  } catch ( e: any ) {
    return new Errors( e )
  }
}

export const createUserService = async ( { email, roles }: { email: string, roles: string[] } ) => {
  try {
    const _newUser = new User()
    _newUser.email = email
    // _newUser.roles = newRoles;
    await _newUser.save()

    await Promise.all( roles.map( async _role => {
      try {
        const _new = new Role()
        _new.role = _role
        _new.user = _newUser
        return await _new.save()
      } catch ( e ) {
        // eslint-disable-next-line no-console
        console.error( e )
      }
    } ) )

    return await User.findOne( {
      where    : { email },
      relations: ['roles']
    } )
  } catch ( e: any ) {
    return new Errors( e )
  }
}

export const updateUserService = async ( id: number, {
  noInduk, name, roles, birthDate, phoneNumber
}: UpdateUserParameter ) => {
  try {
    const _updatedUser = await User.findOne( { where: { id }, relations: ['role'] } )
    if ( !_updatedUser ) return { message: 'User is not found!' }
    _updatedUser.noInduk = noInduk
    _updatedUser.name = name
    if ( birthDate ) {
      _updatedUser.birth_date = birthDate as Date
    }
    _updatedUser.noInduk = noInduk
    _updatedUser.phone_number = phoneNumber
    
    await _updatedUser.save()

    if ( roles?.length ) {
      await Promise.all( roles.map( async _role => {
        try {
          const _new = new Role()
          _new.role = _role
          _new.user = _updatedUser
          return await _new.save()
        } catch ( e ) {
          // eslint-disable-next-line no-console
          console.error( e )
        }
      } ) )
    }

    const updatedUser = await User.findOne( {
      where    : { id },
      relations: ['role', 'role.scopes']
    } )

    if ( updatedUser == null ) throw E_ERROR.USER_NOT_FOUND

    const userScope = scopeFormatter( updatedUser.role.scopes )

    return makeResponse.success( {
      data: {
        id         : updatedUser.id,
        noInduk    : updatedUser.noInduk,
        name       : updatedUser.name,
        role       : updatedUser.role.role,
        scopes     : userScope,
        phoneNumber: updatedUser?.phone_number,
        birthDate  : updatedUser?.birth_date
      },
      stat_code: HTTP_CODE.OK,
      stat_msg : SUCCESS_MESSAGE.LOGIN_SUCCESS
    } )
  } catch ( e: any ) {
    return new Errors( e )
  }
}

export const changePasswordService = async ( id: number, payload: ChangePasswordParameter ) => {
  try {
    const user = await User.findOne( { where: { id } } )
    if ( user == null ) throw E_ERROR.USER_NOT_FOUND

    const hashedPassword = await createHashPassword( payload.newPassword )

    if ( hashedPassword instanceof Error ) throw hashedPassword

    user.password = hashedPassword

    await user.save()

    return makeResponse.success<User>( {
      data     : user,
      stat_code: HTTP_CODE.OK,
      stat_msg : SUCCESS_MESSAGE.CHANGE_PASSWORD_SUCCESS
    } )
  } catch ( e: any ) {
    return await Promise.reject( new Errors( e ) )
  }
}

export const deleteUserService = async ( { id }: { id: number } ) => {
  try {
    const foundUser = await User.findOne( { id } )
    return await foundUser?.remove()
  } catch ( e: any ) {
    return new Errors( e )
  }
}
