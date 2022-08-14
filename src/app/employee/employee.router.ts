import { Controller, Get, Post, Route, Tags } from "tsoa";
import { getAllEmployeeService } from "./employee.service";

@Tags('Pegawai')
@Route('/api/pegawai')
export class employeeController extends Controller{

  @Get("/")
  public async getAllEmployee(){
    return getAllEmployeeService();
  }
  
  @Post('/')
  public async createEmployee(){
  }
  
}