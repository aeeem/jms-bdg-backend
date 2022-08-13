import { Controller, Get, Route, Security, Tags } from "tsoa";
import { getAllRoleService } from "./role.service";

@Tags('Roles')
@Route('/roles')
export class RoleController extends Controller{

  @Security('api_key', ['read:roles'])
  @Get('/')
  public async getAllRoles(){
    return getAllRoleService()
  }
}