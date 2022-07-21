import { Customer } from "@entity/customer";
import { Product } from "@entity/product";
import { Stock } from "@entity/stock";
import { Transaction } from "@entity/transaction";
import { TransactionDetail } from "@entity/transactionDetail";
import _ from "lodash";
import { TransactionRequestParameter } from "./transaction.interface";


export const getAllTransactionService = async () => {
  try {
    return await Transaction.find({
      relations: [
        'customer',
        'transactionDetails',
        'transactionDetails.stock',
        'transactionDetails.stock.product',
        'transactionDetails.stock.vendor'
      ]
    });
  } catch (error) {
    console.error(error)
  }
}



export const createTransactionService = async (payload: TransactionRequestParameter) => {
  try {
    const customer            = await Customer.findOneOrFail({ where : { id : payload.customer_id }})
    const transactionDetails  = await Promise.all(payload.detail.map(async (detail)=>{
      const stock                       = await Stock.findOneOrFail({ where : { id : detail.productId }})
      const _newTransactionDetail       = new TransactionDetail()
      _newTransactionDetail.amount      = detail.amount
      _newTransactionDetail.final_price = detail.final_price
      _newTransactionDetail.sub_total   = detail.sub_total
      _newTransactionDetail.stock       = stock
      return _newTransactionDetail
    }))
    const transaction = new Transaction()
    transaction.customer              = customer
    transaction.transactionDetails    = transactionDetails
    transaction.expected_total_price  = payload.expected_total_price
    transaction.actual_total_price    = payload.actual_total_price

    return await transaction.save()



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