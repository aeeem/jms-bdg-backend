import { User } from "@entity/user"
import { RoleLists } from "src/app/employee/employee.interface"
import { ErrorHandler } from "src/errorHandler"
import makeResponse from "src/helper/response"
import { Not } from "typeorm"


export const getAllEmployeeService = async () => {
  try {
    const employees = await User.find({
     where:{
        role:{
          role: Not(RoleLists.SuperAdmin)
        }
     },
     relations: ['role']
    })

    const formatResponse = employees.map(employee => {
      return {
        id: employee.id,
        name: employee.name,
        email: employee.email,
        noInduk: employee.noInduk,
        role: employee.role.role
      }
    })

    return makeResponse.success({data:formatResponse, stat_msg:"SUCCESS"});
  } catch (error) {
    console.log(error)
    return new ErrorHandler(error)
  }
}