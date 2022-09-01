import { Role } from "@entity/role"
import { User } from "@entity/user"
import _ from "lodash";
import { CreateEmployeeRequest, RoleLists } from "src/app/employee/employee.interface"
import { ErrorHandler } from "src/errorHandler"
import { E_ErrorType } from "src/errorHandler/enums"
import { createHashPassword } from "src/helper/bcrypt"
import makeResponse from "src/helper/response"
import { Not } from "typeorm"

const formatResponse = (employees:User[]) => {
  return  employees.map(employee => {
    return {
      id          : employee.id,
      name        : employee.name,
      email       : employee.email,
      noInduk     : employee.noInduk,
      role        : employee.role,
      roleName    : employee.role.role,
      phone_number: employee.phone_number,
      birth_date  : employee.birth_date
    }
  })
}


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

    const formatEmployee = formatResponse(employees)
    return makeResponse.success({data:formatEmployee, stat_msg:"SUCCESS"});
  } catch (error) {
    console.log(error)
    return new ErrorHandler(error)
  }
}

export const searchEmployeeService = async (query: string) => {
  try {
    
    const employees = await User.createQueryBuilder("user")
    .where('user.name LIKE :query', { query: `%${query}%` })
    .leftJoinAndSelect('user.role', 'role')
    .orderBy('user.id', 'ASC')
    .getMany()
    if (_.isEmpty(employees)) makeResponse.success<User[]>({data:employees, stat_msg:E_ErrorType.E_USER_NOT_FOUND});
    const formatEmployee = formatResponse(employees)
    return makeResponse.success({data:formatEmployee, stat_msg:"SUCCESS"});
  } catch (error) {
    throw new ErrorHandler(error)
  }
}

export const createEmployeeService = async (payload:CreateEmployeeRequest) => {
  try {
    const role = await Role.findOne({where: {id: payload.role_id}})
    if(!role) throw E_ErrorType.E_ROLE_NOT_FOUND; 
    
    const employee        = new User()
    const defaultPassword = await createHashPassword('masuk123')
    if(defaultPassword instanceof Error) throw defaultPassword.message

    employee.name         = payload.name
    employee.noInduk      = payload.noInduk
    employee.phone_number = payload.phone_number
    employee.role_id      = payload.role_id
    employee.role         = role as Role
    employee.password     = defaultPassword
    await employee.save()
    return employee
  } catch (error) {
    console.log(error)
    return new ErrorHandler(error)
  }
}

export const updateEmployeeService = async (id:number, payload:CreateEmployeeRequest) => {
  try {
    const employee = await User.findOne(id)
    if(!employee) throw E_ErrorType.E_EMPLOYEE_NOT_FOUND

    employee.name         = payload.name          ?? employee.name
    employee.email        = payload.email         ?? employee.email
    employee.noInduk      = payload.noInduk       ?? employee.noInduk
    employee.birth_date   = payload.birth_date    ?? employee.birth_date
    employee.phone_number = payload.phone_number  ?? employee.phone_number
    employee.role_id      = payload.role_id       ?? employee.role_id

    await employee.save()
    return employee
  } catch (error) {
    console.log(error)
    return new ErrorHandler(error)
  }
}

export const deleteEmployeeService = async (id:number) => {
  try {
    const employee = await User.findOne(id)
    if(!employee) throw E_ErrorType.E_EMPLOYEE_NOT_FOUND

    await employee.remove()
    return employee
  } catch (error) {
    return new ErrorHandler(error)
  }
}

export const changeEmployeeRoleService = async (id:number, role_id:number) => {
  try {
    if(role_id < 2)   throw E_ErrorType.E_FORBIDDEN_ROLE_INPUT
    const employee  = await User.findOne(id)
    const role      = await Role.findOne(role_id)
    if(!employee)     throw E_ErrorType.E_EMPLOYEE_NOT_FOUND
    if(!role)         throw E_ErrorType.E_ROLE_NOT_FOUND

    employee.role_id = role_id
    await employee.save()
    return employee
  } catch (error) {
    console.log(error)
    return new ErrorHandler(error)
  }
}