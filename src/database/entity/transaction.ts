import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
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

  @OneToOne(()=>Customer, (customer: Customer) => customer.id, { onDelete: 'CASCADE' })
  @JoinColumn()
  customer: Customer;

  @OneToMany(() => TransactionDetail, (transactionDetail: TransactionDetail) => transactionDetail.id, { onDelete: 'CASCADE' })
  @JoinColumn()
  transactionDetails: TransactionDetail[];

  @Column({
    type: 'enum',
    enum: E_TransactionStatus,
    default: E_TransactionStatus.PENDING
  })
  status!: E_TransactionStatus;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => TransactionDetail, transactionDetail => transactionDetail.transaction.id, {onDelete: 'CASCADE'})
  transaction_details: TransactionDetail[];
}