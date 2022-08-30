import Database from "@database";
import { Customer } from "@entity/customer";
import { CustomerMonetary } from "@entity/customerMonetary";
import _ from "lodash";
import { db } from "src/app";
import { E_Recievables } from "src/database/enum/hutangPiutang";
import { ErrorHandler } from "src/errorHandler";
import { E_ErrorType } from "src/errorHandler/enums";
import { CustomerRequestParameter, CustomerUpdateRequestParameter } from "./customer.interface";


export const getAllCustomerService = async () => {
  try {
    return await Customer.find({relations:[
      'monetary', 'monetary.transactions'
    ]});
  } catch (error) {
    return error
  }
}

export const getCustomerByIdService = async (id: string) => {
  try {
    const customer = await Customer.findOne({where:{id}, relations:[
      'monetary', 'monetary.transactions'
    ]});
    if (_.isEmpty(customer)) return customer
    return customer
  } catch (error) {
    throw new ErrorHandler(error)
  }
}

export const searchCustomerService = async (query: string) => {
  try {
    
    const customer = await Customer.createQueryBuilder("customer")
    .where('customer.name LIKE :query', { query: `%${query}%` })
    .leftJoinAndSelect('customer.monetary', 'monetary')
    .leftJoinAndSelect('monetary.transactions', 'transactions')
    .orderBy('customer.id', 'ASC')
    .getMany()
    if (_.isEmpty(customer)) throw E_ErrorType.E_CUSTOMER_NOT_FOUND;
    return customer;
  } catch (error) {
    throw new ErrorHandler(error)
  }
}

export const createCustomerService = async (payload: CustomerRequestParameter) => {
  const queryRunner = db.queryRunner()
  try {
    await queryRunner.startTransaction()
    const _newCustomer = new Customer();
    _newCustomer.name = payload.name;
    _newCustomer.contact_number = payload.contact_number;
    await queryRunner.manager.save(_newCustomer);

    const _customerMonet = new CustomerMonetary()
    _customerMonet.customer = _newCustomer;
    if(payload.hutang) {
      _customerMonet.amount = payload.hutang;
      _customerMonet.type = E_Recievables.DEBT;
    } else if(payload.piutang) {
      _customerMonet.amount = payload.piutang;
      _customerMonet.type = E_Recievables.RECIEVABLE;
    }
    if(payload.hutang || payload.piutang) {
      await queryRunner.manager.save(_customerMonet);
    }
    await queryRunner.commitTransaction()
    return await Customer.findOne({
      where: { id: _newCustomer.id }
    });
  } catch (error) {
    await queryRunner.rollbackTransaction()
    return error
  } finally {
    await queryRunner.release()
  }
}

export const updateCustomerService = async (id: string, payload: CustomerUpdateRequestParameter) => {
  try {
    const customer = await Customer.findOne({ where: { id } });
    if(customer){
      customer['name'] = payload.name ? payload.name : customer['name'];
      customer['contact_number'] = payload.contact_number ? payload.contact_number : customer['contact_number'];
      await customer.save();
    }else throw E_ErrorType.E_CUSTOMER_NOT_FOUND
    return await Customer.findOne({
      where: { id }
    });
  } catch (error) {
    throw new ErrorHandler(error)
  }
}

export const deleteCustomerService = async (id: string) => {
  try {
    const customer = await Customer.findOne({ where: { id } });
    if(customer){
      await customer.remove();
    }else throw E_ErrorType.E_CUSTOMER_NOT_FOUND

  } catch (error) {
    throw new ErrorHandler(error)
  }
}