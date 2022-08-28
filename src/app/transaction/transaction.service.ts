import { Customer } from "@entity/customer";
import { Product } from "@entity/product";
import { Transaction } from "@entity/transaction";
import { TransactionDetail } from "@entity/transactionDetail";
import _ from "lodash";
import { db } from "src/app";
import { TRANSACTION_STATUS } from "src/constants/languageEnums";
import { ErrorHandler } from "src/errorHandler";
import { E_ErrorType } from "src/errorHandler/enums";
import { TransactionRequestParameter } from "./transaction.interface";


export const getAllTransactionService = async () => {
  try {
    const transactions = await Transaction.find({
      relations: [
        'customer',
        'transactionDetails',
        'transactionDetails.product',
        'transactionDetails.product.stock',
        'transactionDetails.product.stock.vendor'
      ]
    });
    return transactions.map(transaction=>{
      return {
        id: transaction.id,
        expected_total_price: transaction.expected_total_price,
        actual_total_price: transaction.actual_total_price,
        amount_paid: transaction.amount_paid,
        change: transaction.change,
        outstanding_amount: transaction.outstanding_amount,
        customer: {
          id: transaction.customer.id,
          name: transaction.customer.name,
          phone: transaction.customer.contact_number,
        },
        items: transaction.transactionDetails.map(detail=>{
          return {
            id: detail.id,
            amount: detail.amount,
            final_price: detail.final_price,
            product: {
              id: detail.product.id,
              name: detail.product.name,
              vendor: detail.product.stock.vendor.name
            },
            sub_total: detail.sub_total

          }
        }),
        status: transaction.status,
        created_at: transaction.created_at,
        updated_at: transaction.updated_at
      }
    })
  } catch (error) {
    console.log(error)
    return Promise.reject(new ErrorHandler(error))
  }
}



export const createTransactionService = async (payload: TransactionRequestParameter) => {
  const queryRunner = db.queryRunner()
  try {
    await queryRunner.startTransaction()
    const customer = await Customer.findOne({ where : { id : payload.customer_id }})
    if(!customer) throw E_ErrorType.E_CUSTOMER_NOT_FOUND

    const products = await Product.find({ relations: ['stock'] })

    let expected_total_price = 0
    let actual_total_price = 0;

    const transactionDetails  = await Promise.all(payload.detail.map(async (transactionDetail) => {
      const product = products.find((product) => product.id === transactionDetail.productId)
      if(!product) throw E_ErrorType.E_PRODUCT_NOT_FOUND

      expected_total_price += product.stock.sell_price      * transactionDetail.amount
      actual_total_price   += transactionDetail.final_price * transactionDetail.amount

      product.stock.total_stock -= transactionDetail.amount
      await queryRunner.manager.save(product)

      const detail          = new TransactionDetail()
      detail.amount         = transactionDetail.amount
      detail.final_price    = transactionDetail.final_price
      detail.sub_total      = transactionDetail.sub_total
      detail.product_id     = transactionDetail.productId

      return detail
    }))

    // safety check in-case someone try to alter the payload incorrectly
    if(expected_total_price !== payload.expected_total_price) throw E_ErrorType.E_EXPECTED_TOTAL_PRICE_NOT_MATCH

    const transaction = new Transaction()
    transaction.customer              = customer
    transaction.transactionDetails    = transactionDetails
    transaction.expected_total_price  = expected_total_price
    transaction.actual_total_price    = payload.actual_total_price
    transaction.amount_paid           = payload.amount_paid
    if(payload.amount_paid < actual_total_price) {
      transaction.status              = TRANSACTION_STATUS.PENDING
      transaction.outstanding_amount  = actual_total_price - payload.amount_paid
    }else{
      transaction.status              = TRANSACTION_STATUS.PAID
      transaction.change              = payload.amount_paid - actual_total_price
    }

    await queryRunner.manager.save(transaction)
    await queryRunner.commitTransaction()

    return transaction

  } catch (error:any) {
    await queryRunner.rollbackTransaction()
    console.log(error)
    return Promise.reject(new ErrorHandler(error))
  }finally{
    await queryRunner.release()
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
    return Promise.reject(new ErrorHandler(error))
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
    return Promise.reject(new ErrorHandler(error))
  }
}

export const deleteTransactionService = async (id:string) => {
  try {
    const transaction = await Transaction.findOneOrFail({ where: { id} });
    await transaction.remove();
    return { message: "Transaction is deleted!" };
  } catch (error) {
    return Promise.reject(new ErrorHandler(error))
  }
}