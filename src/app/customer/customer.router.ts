import { Body, Controller, Delete, Get, Path, Post, Put, Query, Route, Security, SuccessResponse, Tags } from "tsoa";
import { createCustomerService, deleteCustomerService, getAllCustomerService, getCustomerByIdService, searchCustomerService, updateCustomerService } from "./customer.service";
import { CustomerRequestParameter, CustomerUpdateRequestParameter } from "./customer.interface";
import makeResponse from "src/helper/response";
import { ErrorHandler } from "src/errorHandler";
import { HTTP_CODE } from "src/errorHandler/enums";

@Tags('Customer')
@Route('/api/customer')

export class CustomerController extends Controller {
  
  @Get('/')
  @Security('api_key', ['read:customer'])
  public async getAllCustomer() {
    try {
      const customer = await getAllCustomerService();
      return makeResponse.success({data: customer});
    } catch (error) {
      new ErrorHandler(error)
    }
  }

  @Get('/detail/{id}')
  @Security('api_key', ['read:customer'])
  public async findCustomerById(@Path() id: string) {
    try {
      const customer = await getCustomerByIdService(id);
      return makeResponse.success({data: customer});
    } catch (error: any) {
      return makeResponse.error({
        stat_code: HTTP_CODE.INTERNAL_SERVER_ERROR,
        stat_msg: error.message
      })
    }
  }

  @Get('/search/')
  @Security('api_key',['read:customer'])
  public async searchCustomer(@Query('query') query: string) {
    try {
      const customer = await searchCustomerService(query);
      return  makeResponse.success({data: customer})
    } catch (error:any) {
      return makeResponse.error({
        stat_code: HTTP_CODE.INTERNAL_SERVER_ERROR,
        stat_msg: error.message
      })
    }
  }

  @Post('/')
  @Security('api_key',['create:customer'])
  public async createCustomer(@Body() payload: CustomerRequestParameter) {
    return createCustomerService(payload);
  }

  @Put('/{id}/')
  @Security('api_key',["update:customer"])
  public async updateCustomer(@Path() id: string, @Body() payload: CustomerUpdateRequestParameter) {
    try {
      const customer = await updateCustomerService(id, payload);
      return makeResponse.success({data: customer});
    } catch (error:any) {
      return makeResponse.error({
        stat_code: HTTP_CODE.INTERNAL_SERVER_ERROR,
        stat_msg: error.message
      })      
    }
  }

  @Delete('/{id}/')
  @Security('api_key',["delete:customer"])
  public async deleteCustomer(@Path() id: string) {
    try {
      await deleteCustomerService(id);
      return makeResponse.success({data: {}});
    } catch (error:any) {
      return makeResponse.error({
        stat_code: HTTP_CODE.INTERNAL_SERVER_ERROR,
        stat_msg: error.message
      })
    }
  }
}