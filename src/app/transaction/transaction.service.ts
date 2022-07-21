import { Customer } from "@entity/customer";
import { Transaction } from "@entity/transaction";
import _ from "lodash";
import { TransactionRequestParameter } from "./transaction.interface";


export const getAllTransactionService = async () => {
  try {
    return await Transaction.find();
  } catch (error) {
    console.error(error)
  }
}

export const createTransactionService = async (payload: TransactionRequestParameter) => {
  try {
    const customer                        = await Customer.findOneOrFail({ where : { id : payload.customer_id }})
    const _newTransaction = await Transaction.insert({
      expected_total_price: payload.expected_total_price,
      actual_total_price: payload.actual_total_price,
      transaction_details: payload.detail,
      customer
    })
    
    return _newTransaction.generatedMaps
    
  } catch (error) {
    console.error(error)
  }
}

export const searchTransactionService = async (query: string) => {
  try {
    const transaction = await Transaction.createQueryBuilder()
      .leftJoinAndMapMany('detail', 'TransactionDetail', 'detail.id = transaction.id')
      .leftJoinAndMapMany('customer', 'Customer', 'customer.id = transaction.customer_id')
      .where('transaction.id LIKE :query OR customer.name LIKE :query', { query })
      .getMany();
      
      if(_.isEmpty(transaction)) return { message: "Transaction is not found!" };
      return transaction
  } catch (error) {
    console.error(error)
  }
}

export const updateTransactionService = async (id:string , payload: TransactionRequestParameter) => {
  try {
    const transaction                   = await Transaction.findOneOrFail({ where: { id} });
    const customer                      = await Customer.findOneOrFail({ where: { id: payload.customer_id } });
    transaction['expected_total_price'] = payload.expected_total_price;
    transaction['actual_total_price']   = payload.actual_total_price;
    transaction['customer']             = customer;
    await transaction.save();
    
    return await Transaction.findOne({
      where: { id }
    });
  } catch (error) {
    console.error(error)
  }
}

export const deleteTransactionService = async (id:string) => {
  try {
    const transaction = await Transaction.findOneOrFail({ where: { id} });
    await transaction.remove();
    return { message: "Transaction is deleted!" };
  } catch (error) {
    console.error(error)
  }
}