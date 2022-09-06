import {
  Controller, Get, Route, Security, Tags
} from 'tsoa'
import { getAllRoleService } from './role.service'

@Tags( 'Roles' )
@Route( '/api/roles' )
export class RoleController extends Controller {
  @Security( 'api_key', ['read:role'] )
  @Get( '/' )
  public async getAllRoles () {
    return await getAllRoleService()
  }
}
