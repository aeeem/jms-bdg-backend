import { BaseEntity, Column, CreateDateColumn, Entity, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Product } from "./product";

@Entity({name:'transaction_detail'})
export class TransactionDetail extends BaseEntity {
  
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  transaction_id: number;

  @OneToOne(() => Product, {onDelete: 'CASCADE'})
  @Column()
  product_sku: string;

  @Column()
  amount: number;

  @Column()
  sub_total: number;

  @Column()
  final_price: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}