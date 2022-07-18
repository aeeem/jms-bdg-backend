import { Body, Controller, Delete, Get, Post, Put, Query, Route, Tags } from "tsoa";
import { createCustomerService, deleteCustomerService, getAllCustomerService, searchCustomerService, updateCustomerService } from "./customer.interfaces";
import { CustomerRequestParameter } from "./customer.service";


@Tags('Customer')
@Route('/api/customer')
export class CustomerController extends Controller {

  @Get('/')
  public async getAllCustomer() {
    return getAllCustomerService()
  }

  @Get('/search/{query}')
  public async searchCustomer(query: string) {
    return searchCustomerService(query);
  }

  @Post('/')
  public async createCustomer(@Body() payload: CustomerRequestParameter) {
    return createCustomerService(payload);
  }

  @Put('/{id}/')
  public async updateCustomer(@Query('id') id: string, @Body() payload: CustomerRequestParameter) {
    return updateCustomerService(id, payload);
  }

  @Delete('/{id}/')
  public async deleteCustomer(@Query('id') id: string) {
    return deleteCustomerService(id);
  }
}