import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Product } from "./product";
import { Stock } from "./stock";
import { Transaction } from "./transaction";

@Entity({name:'transaction_detail'})
export class TransactionDetail extends BaseEntity {
  
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  amount: number;

  @Column()
  sub_total: number;

  @Column()
  final_price: number;

  @ManyToOne(()=> Transaction, (transaction: Transaction) => transaction.id, {onDelete: 'CASCADE'})
  @JoinColumn()
  transaction: Transaction;

  @ManyToOne(()=> Stock, (stock: Stock) => stock.id, {onDelete: 'CASCADE'})
  @JoinColumn()
  stock: Stock;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}