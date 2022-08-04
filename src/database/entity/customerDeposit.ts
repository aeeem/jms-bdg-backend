import { BaseEntity, Column, CreateDateColumn, Entity, JoinTable, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Customer } from "./customer";
import { Transaction } from "./transaction";

@Entity('customer_deposit')
export class CustomerDeposit extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name!: string;

  @Column()
  contact_number: string;

  @ManyToOne(() => Customer, (transaction: Customer) => transaction.deposits, { onDelete: 'CASCADE' })
  customer: Customer;

  @OneToMany(() => Transaction, (transaction: Transaction) => transaction.customer, { onDelete: 'CASCADE' })
  @JoinTable()
  transactions: Transaction[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}