import { BaseEntity, Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { E_TransactionStatus } from "../enum/transaction";
import { Customer } from "./customer";
import { TransactionDetail } from "./transactionDetail";

@Entity({name:'transaction'})
export class Transaction extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;
  
  @Column()
  expected_total_price: number;
  
  @Column()
  actual_total_price!: number;

  @OneToOne(()=>Customer)
  @Column()
  customer_id!: number;

  @Column({
    type: 'enum',
    enum: E_TransactionStatus,
    default: E_TransactionStatus.PENDING
  })
  status!: E_TransactionStatus;

  @Column()
  created_at: Date;

  @Column()
  updated_at: Date;

  @OneToMany(() => TransactionDetail, transactionDetail => transactionDetail.transaction_id, {onDelete: 'CASCADE'})
  transaction_details: TransactionDetail[];
}