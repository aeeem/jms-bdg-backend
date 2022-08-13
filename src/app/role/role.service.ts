import { Role } from "@entity/role"
import { ErrorHandler } from "src/errorHandler"


export const getAllRoleService = async () => {
  try {
    const roles = await Role.find({
      relations: [
        'scopes'
      ]
    })
    
    return roles
  } catch (error:any) {
    return new ErrorHandler(error)
  }
}