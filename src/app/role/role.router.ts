import { Controller, Get, Route, Security, Tags } from "tsoa";

@Tags('Roles')
@Route('/roles')
export class RoleController extends Controller{

  @Get('/')
}