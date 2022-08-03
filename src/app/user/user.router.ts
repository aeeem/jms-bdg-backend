import { Body, Controller, Delete, Get, Post, Put, Query, Route, Security, Tags } from 'tsoa';
import { getAllUserService, createUserService, updateUserService, deleteUserService } from './user.service';

@Tags('User Permission')
@Route('/api/user-permission')
@Security('api_key')
export class UserPermissionController extends Controller {

  @Get('/get-all/')
  public async getAllUser() {
    return getAllUserService()
  }

  @Post('/create/')
  public async createUser(@Body() body: { email: string, roles: string[] }) {
    return createUserService({ email: body.email, roles: body.roles });
  }

  @Put('/update/{id}/')
  public async updateUser(@Query('id') id: string, @Body() body: { email: string, roles: string[] }) {
    return updateUserService({ id: Number(id), email: body.email, roles: body.roles });
  }

  @Delete('/delete/{id}/')
  public async deleteUser(@Query('id') id: string) {
    return deleteUserService({ id: Number(id) });
  }

}

