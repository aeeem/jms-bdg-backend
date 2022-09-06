import { Vendor } from '@entity/vendor'
import makeResponse from 'src/helper/response'
import _ from 'lodash'
import { VendorRequestParameter } from './vendor.interfaces'
import { Errors } from 'src/errorHandler'

export const getAllVendorService = async () => {
  try {
    const vendors = await Vendor.find()
    return makeResponse.success<Vendor[]>( { data: vendors, stat_msg: 'SUCCESS' } )
  } catch ( error: any ) {
    return new Errors( error )
  }
}

export const findVendorService = async ( query: string ) => {
  try {
    const vendor = await Vendor.createQueryBuilder( 'vendor' )
      .where( 'vendor.code LIKE :query', { query: `%${query}%` } )
      .getMany()
    if ( _.isEmpty( vendor ) ) makeResponse.success<Vendor[]>( { data: vendor, stat_msg: 'NOT_FOUND' } )
    return makeResponse.success<Vendor[]>( { data: vendor, stat_msg: 'SUCCESS' } )
  } catch ( error: any ) {
    return new Errors( error )
  }
}

export const addVendorService = async ( body: VendorRequestParameter ) => {
  try {
    const _newVendor = new Vendor()
    _newVendor.name = body.name
    _newVendor.code = body.code
    _newVendor.shipping_cost = body.shipping_cost
    _newVendor.address = body.address
    _newVendor.pic_name = body.pic_name
    _newVendor.pic_phone_number = body.pic_phone_number
    await _newVendor.save()
    return await Vendor.findOne( { where: { id: _newVendor.id } } )
  } catch ( error: any ) {
    return new Errors( error )
  }
}

export const updateVendorService = async ( id: string, body: VendorRequestParameter ) => {
  try {
    const vendor = await Vendor.findOneOrFail( { where: { id } } )
    vendor.address = body.address
    vendor.name = body.name
    vendor.code = body.code
    vendor.shipping_cost = body.shipping_cost
    vendor.pic_name = body.pic_name
    vendor.pic_phone_number = body.pic_phone_number
    await vendor.save()
    return await Vendor.findOne( { where: { id } } )
  } catch ( error: any ) {
    return new Errors( error )
  }
}

export const deleteVendorService = async ( id: string ) => {
  try {
    const vendor = await Vendor.findOneOrFail( { where: { id } } )
    await vendor.remove()
    return { message: 'Vendor is deleted!' }
  } catch ( error: any ) {
    return new Errors( error )
  }
}
