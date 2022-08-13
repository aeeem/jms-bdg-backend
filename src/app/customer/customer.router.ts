import { Body, Controller, Delete, Get, Post, Put, Query, Route, Security, Tags } from "tsoa";
import { createCustomerService, deleteCustomerService, getAllCustomerService, searchCustomerService, updateCustomerService } from "./customer.service";
import { CustomerRequestParameter } from "./customer.interface";

@Tags('Customer')
@Route('/api/customer')

export class CustomerController extends Controller {
  
  @Get('/')
  @Security('api_key', ['read:customer'])
  public async getAllCustomer() {
    return getAllCustomerService()
  }

  @Get('/search/{query}')
  @Security('api_key',['read:customer'])
  public async searchCustomer(query: string) {
    return searchCustomerService(query);
  }

  @Post('/')
  @Security('api_key',['create:customer'])
  public async createCustomer(@Body() payload: CustomerRequestParameter) {
    return createCustomerService(payload);
  }

  @Put('/{id}/')
  @Security('api_key',["update:customer"])
  public async updateCustomer(@Query('id') id: string, @Body() payload: CustomerRequestParameter) {
    return updateCustomerService(id, payload);
  }

  @Delete('/{id}/')
  @Security('api_key',["delete:customer"])
  public async deleteCustomer(@Query('id') id: string) {
    return deleteCustomerService(id);
  }
}