import {
  BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn
} from 'typeorm'
import { Product } from './product'
import { TransactionDetail } from './transactionDetail'

@Entity( { name: 'stock' } )
export class Stock extends BaseEntity {
  @PrimaryGeneratedColumn()
    id: number

  @Column( 'decimal', {
    nullable: true, precision: 6, scale: 2
  } )
    stock_toko!: number

  @Column( { nullable: true } )
    stock_gudang!: number

  @Column( { nullable: true } )
    buy_price: number

  @Column( { nullable: true } )
    sell_price: number

  @Column( { nullable: true } )
    weight: number

  @ManyToOne( () => Product, { onDelete: 'CASCADE' } )
  @JoinColumn( { name: 'productId' } )
    product: Product

  @Column( { nullable: true } )
    productId: number

  @OneToMany( () => TransactionDetail, transactionDetail => transactionDetail.stock )
    transactionDetails: TransactionDetail[]

  @CreateDateColumn()
    created_at: Date

  @UpdateDateColumn()
    updated_at: Date
}
