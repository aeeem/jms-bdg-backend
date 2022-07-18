import { Body, Controller, Delete, Get, Post, Put, Query, Route, Tags } from "tsoa";
import { AddVendorRequestParameter, UpdateVendorRequestParameter } from "./vendor.interfaces";
import { addVendorService, deleteVendorService, findVendorService, getAllVendorService, updateVendorService } from "./vendor.service";

@Tags('Vendor')
@Route('/api/vendor')
export class VendorController extends Controller{

  @Get('/')
  public async getAllVendor() {
    return getAllVendorService()
  }

  @Get('/search/:query')
  public async findVendor(@Query('query') query: string) {
    return findVendorService(query)
  }

  @Post('/')
  public async addVendor(@Body() body: AddVendorRequestParameter) {
    return addVendorService(body)
  }
  
  @Put('/{id}/')
  public async updateVendor(@Query('id') id: string, @Body() body : UpdateVendorRequestParameter) {
    return updateVendorService(id,body)
  }

  @Delete('/{id}/')
  public async deleteVendor(@Query('id') id: string) {
    return deleteVendorService(id)
  }
}