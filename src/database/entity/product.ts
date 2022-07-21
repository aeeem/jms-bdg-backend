import { Entity, Column, BaseEntity, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Stock } from "./stock";
import { TransactionDetail } from "./transactionDetail";

@Entity({ name: 'product' })
export class Product extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique: true, })
  sku!: string;

  @Column({ unique: true })
  name!: string;
  
  @OneToMany(() => Stock, stock => stock.product, { cascade: true })
  stocks: Stock[]

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

}