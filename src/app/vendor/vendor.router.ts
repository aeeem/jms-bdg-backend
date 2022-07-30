import { Body, Controller, Delete, Get, Post, Put, Query, Route, Tags } from "tsoa";
import { VendorRequestParameter } from "./vendor.interfaces";
import { addVendorService, deleteVendorService, findVendorService, getAllVendorService, updateVendorService } from "./vendor.service";

@Tags('Vendor')
@Route('/api/vendor')
export class VendorController extends Controller{

  @Get('/')
  public async getAllVendor() {
    return getAllVendorService()
  }

  @Get('/search/')
  public async findVendor(@Query('query') query: string) {
    return findVendorService(query)
  }

  @Post('/')
  public async addVendor(@Body() body: VendorRequestParameter) {
    return addVendorService(body)
  }
  
  @Put('/')
  public async updateVendor(@Query('id') id: string, @Body() body : VendorRequestParameter) {
    return updateVendorService(id,body)
  }

  @Delete('/')
  public async deleteVendor(@Query('id') id: string) {
    return deleteVendorService(id)
  }
}