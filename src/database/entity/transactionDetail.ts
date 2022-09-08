import {
  BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn
} from 'typeorm'
import { Product } from './product'
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
  @JoinColumn()
    transaction: Transaction

  @ManyToOne( () => Product, ( product: Product ) => product.id, { onDelete: 'CASCADE' } )
  @JoinColumn( { name: 'product_id' } )
    product: Product

  @Column()
    product_id: number

  @CreateDateColumn()
    created_at: Date

  @UpdateDateColumn()
    updated_at: Date
}
