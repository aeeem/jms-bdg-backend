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
    const _newTransaction = new Transaction();
    _newTransaction.expected_total_price = payload.expected_total_price;
    _newTransaction.actual_total_price = payload.actual_total_price;
    _newTransaction.status = payload.status;
    _newTransaction.customer_id = payload.customer_id;
    await _newTransaction.save();
    return await Transaction.findOne({
      where: { id: _newTransaction.id }
    });
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
    const transaction = await Transaction.findOneOrFail({ where: { id} });
    transaction['expected_total_price'] = payload.expected_total_price;
    transaction['actual_total_price'] = payload.actual_total_price;
    transaction['status'] = payload.status;
    transaction['customer_id'] = payload.customer_id;
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