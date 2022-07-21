import { BaseEntity, Column, CreateDateColumn, Entity, JoinTable, OneToMany, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Transaction } from "./transaction";

@Entity('customer')
export class Customer extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name!: string;

  @Column()
  contact_number: string;

  @OneToMany(() => Transaction, (transaction: Transaction) => transaction.customer, { onDelete: 'CASCADE' })
  @JoinTable()
  transactions: Transaction[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}