import { Customer } from "@entity/customer";
import _ from "lodash";
import { CustomerRequestParameter } from "./customer.service";


export const getAllCustomerService = async () => {
  try {
    return await Customer.find();
  } catch (error) {
    console.error(error);
  }
}

export const searchCustomerService = async (query: string) => {
  try {
    const customer = await Customer.createQueryBuilder()
      .where('name LIKE :query', { query })
      .getMany();
    if (_.isEmpty(customer)) return { message: "Customer is not found!" };
    return customer;
  } catch (error) {
    console.error(error);
  }
}

export const createCustomerService = async (payload: CustomerRequestParameter) => {
  try {
    const _newCustomer = new Customer();
    _newCustomer.name = payload.name;
    _newCustomer.contact_number = payload.contact_number;
    await _newCustomer.save();
    return await Customer.findOne({
      where: { id: _newCustomer.id }
    });
  } catch (error) {
    console.error(error);
  }
}

export const updateCustomerService = async (id: string, payload: CustomerRequestParameter) => {
  try {
    const customer = await Customer.findOneOrFail({ where: { id } });
    customer['name'] = payload.name;
    customer['contact_number'] = payload.contact_number;
    await customer.save();
    return await Customer.findOne({
      where: { id }
    });
  } catch (error) {
    console.error(error);
  }
}

export const deleteCustomerService = async (id: string) => {
  try {
    const customer = await Customer.findOneOrFail({ where: { id } });
    await customer.remove();
    return { message: "Customer is deleted!" };
  } catch (error) {
    console.error(error);
  }
}