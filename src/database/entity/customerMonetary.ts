import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { E_Recievables } from "../enum/hutangPiutang";
import { Customer } from "./customer";
import { Transaction } from "./transaction";

@Entity('customer_monetary')
export class CustomerMonetary extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: E_Recievables,
    nullable: false
  })
  type: E_Recievables;

  @Column()
  amount: number;

  @ManyToOne(() => Customer, (transaction: Customer) => transaction.monetary, { onDelete: 'CASCADE' })
  @JoinColumn({ name: "cusotmer_id" })
  customer: Customer;

  @OneToMany(() => Transaction, (transaction: Transaction) => transaction.customer, { onDelete: 'CASCADE' })
  @JoinTable()
  transactions: Transaction[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}