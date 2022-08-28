import makeResponse from "src/helper/response";
import { Body, Controller, Delete, Get, Patch, Path, Post, Put, Route, Tags } from "tsoa";
import { ChangeEmployeeRole, CreateEmployeeRequest } from "./employee.interface";
import { changeEmployeeRoleService, createEmployeeService, deleteEmployeeService, getAllEmployeeService, updateEmployeeService } from "./employee.service";

@Tags('Pegawai')
@Route('/api/pegawai')
export class employeeController extends Controller{

  @Get("/")
  public async getAllEmployee(){
    return getAllEmployeeService();
  }
  
  @Post('/')
  public async createEmployee(@Body() body: CreateEmployeeRequest){
    try {
      const createdEmployee = await createEmployeeService(body);
      return makeResponse.success({
        data: createdEmployee
      })
    } catch (error) {
      return error
    }
  }

  @Put('/{id}')
  public async updateEmployee(@Path() id: number, @Body() body: CreateEmployeeRequest){
    try {
      const updatedEmployee = await updateEmployeeService(id, body);
      return makeResponse.success({
        data: updatedEmployee
      })
    } catch (error) {
      return error
    }
  }
  
  @Delete('/{id}')
  public async deleteEmployee(@Path() id: number){
    try {
      const deletedEmployee = await deleteEmployeeService(id);
      return makeResponse.success({
        data: deletedEmployee
      })
    } catch (error) {
      return error
    }
  }

  @Patch('/{id}')
  public async changeEmployeeRole(@Path() id: number, @Body() {role_id}: ChangeEmployeeRole){
    try {
      const patchedEmployee = await changeEmployeeRoleService(id, role_id);
      return makeResponse.success({
        data: patchedEmployee
      })
    } catch (error) {
      return error
    }
  }
}