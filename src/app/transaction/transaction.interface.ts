import { Transaction } from "@entity/transaction";
import { TransactionDetail } from "@entity/transactionDetail";

type PartialTransaction = Pick<Transaction, "expected_total_price" |"actual_total_price" | "transaction_details" | "status" | "customer_id">;
type PartialTransactionDetail = Pick<TransactionDetail, "amount" | "final_price" | "product_sku" | "sub_total">

export type TransactionRequestParameter = PartialTransaction & {
  detail: PartialTransactionDetail[]
};
