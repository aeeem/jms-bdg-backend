import { Customer } from "@entity/customer";
import { Product } from "@entity/product";
import { Stock } from "@entity/stock";
import { Transaction } from "@entity/transaction";
import { TransactionDetail } from "@entity/transactionDetail";
import _ from "lodash";
import { ErrorHandler } from "src/errorHandler";
import { E_ErrorType } from "src/errorHandler/enums";
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
    const customer            = await Customer.findOne({ where : { id : payload.customer_id }})
    if(!customer) throw E_ErrorType.E_CUSTOMER_NOT_FOUND

    const products = await Product.find({ relations: ['stocks'] })

    let expected_total_price = 0
    let actual_total_price = 0;

    const transactionDetails  = payload.detail.map((transactionDetail) => {
      const product = products.find((product) => product.id === transactionDetail.productId)
      if(!product) throw E_ErrorType.E_PRODUCT_NOT_FOUND

      expected_total_price += product.stock.sell_price      * transactionDetail.amount
      actual_total_price   += transactionDetail.final_price * transactionDetail.amount
      const detail          = new TransactionDetail()
      
      detail.amount         = transactionDetail.amount
      detail.final_price    = transactionDetail.final_price
      detail.sub_total      = transactionDetail.sub_total
      detail.product_id     = transactionDetail.productId
      return detail
    })

    if(expected_total_price !== payload.expected_total_price) throw E_ErrorType.E_EXPECTED_TOTAL_PRICE_NOT_MATCH

    const transaction = new Transaction()
    transaction.customer              = customer
    transaction.transactionDetails    = transactionDetails
    transaction.expected_total_price  = expected_total_price
    transaction.actual_total_price    = payload.actual_total_price

    await transaction.save()

    return transaction

  } catch (error) {
    throw new ErrorHandler(error)
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