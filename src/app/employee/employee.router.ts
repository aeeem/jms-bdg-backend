import makeResponse from 'src/helper/response'
import {
  Body, Controller, Delete, Get, Patch, Path, Post, Put, Route, Security, Tags, Query
} from 'tsoa'
import { ChangeEmployeeRole, CreateEmployeeRequest } from './employee.interface'
import {
  changeEmployeeRoleService, createEmployeeService, deleteEmployeeService, getAllEmployeeService, updateEmployeeService, searchEmployeeService
} from './employee.service'

@Tags( 'Pegawai' )
@Route( '/api/pegawai' )
export class employeeController extends Controller {
  @Security( 'api_key', ['read:pegawai'] )
  @Get( '/' )
  public async getAllEmployee () {
    try {
      return await getAllEmployeeService()
    } catch ( error ) {
      return error
    }
  }
  
  @Security( 'api_key', ['create:pegawai'] )
  @Post( '/' )
  public async createEmployee ( @Body() body: CreateEmployeeRequest ) {
    try {
      const createdEmployee = await createEmployeeService( body )
      return makeResponse.success( { data: createdEmployee } )
    } catch ( error ) {
      return error
    }
  }
  
  @Security( 'api_key', ['update:pegawai'] )
  @Put( '/{id}' )
  public async updateEmployee ( @Path() id: number, @Body() body: CreateEmployeeRequest ) {
    try {
      const updatedEmployee = await updateEmployeeService( id, body )
      return makeResponse.success( { data: updatedEmployee } )
    } catch ( error ) {
      return error
    }
  }

  @Get( '/search/' )
  @Security( 'api_key', ['read:customer'] )
  public async searchEmployee ( @Query( 'query' ) query: string ) {
    try {
      return await searchEmployeeService( query )
    } catch ( error: any ) {
      return error
    }
  }

  @Security( 'api_key', ['delete:pegawai'] )
  @Delete( '/{id}' )
  public async deleteEmployee ( @Path() id: number ) {
    try {
      const deletedEmployee = await deleteEmployeeService( id )
      return makeResponse.success( { data: deletedEmployee } )
    } catch ( error ) {
      return error
    }
  }

  @Security( 'api_key', ['update:pegawai'] )
  @Patch( '/{id}' )
  public async changeEmployeeRole ( @Path() id: number, @Body() { role_id }: ChangeEmployeeRole ) {
    try {
      const patchedEmployee = await changeEmployeeRoleService( id, role_id )
      return makeResponse.success( { data: patchedEmployee } )
    } catch ( error ) {
      return error
    }
  }
}
