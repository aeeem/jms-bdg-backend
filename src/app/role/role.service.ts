import { Role } from '@entity/role'
import { Errors } from 'src/errorHandler'
import { scopeFormatter } from 'src/helper/scopeHelper'

export const getAllRoleService = async () => {
  try {
    const roles = await Role.find( { relations: ['scopes'] } )

    const formattedRoles = roles.map( role => {
      return {
        ...role,
        scopes: scopeFormatter( role.scopes )
      }
    } )
    
    return formattedRoles
  } catch ( error: any ) {
    return new Errors( error )
  }
}
