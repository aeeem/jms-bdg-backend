import {
  BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn
} from 'typeorm'
import { Stock } from './stock'
import { Transaction } from './transaction'

@Entity( { name: 'transaction_detail' } )
export class TransactionDetail extends BaseEntity {
  @PrimaryGeneratedColumn()
    id: number

  @Column()
    amount: number

  @Column()
    sub_total: number

  @ManyToOne( () => Transaction, ( transaction: Transaction ) => transaction.id, { onDelete: 'CASCADE' } )
  @JoinColumn( { name: 'transaction_id' } )
    transaction: Transaction

  @ManyToOne( () => Stock, ( stock: Stock ) => stock.id )
  @JoinColumn( { name: 'stock_id' } )
    stock: Stock

  @Column()
    stock_id: number

  @Column( { nullable: true } )
    transaction_id?: number

  @CreateDateColumn()
    created_at: Date

  @UpdateDateColumn()
    updated_at: Date

  @DeleteDateColumn()
    deleted_at?: Date
}
