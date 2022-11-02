import {
  BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn
} from 'typeorm'
import { Product } from './product'

@Entity( { name: 'stock' } )
export class Stock extends BaseEntity {
  @PrimaryGeneratedColumn()
    id: number

  @Column( { nullable: true } )
    stock_toko!: number

  @Column( { nullable: true } )
    stock_gudang!: number

  @Column( { nullable: true } )
    buy_price: number

  @Column( { nullable: true } )
    sell_price: number

  @ManyToOne( () => Product, { onDelete: 'CASCADE' } )
  @JoinColumn( { name: 'productId' } )
    product: Product

  @Column( { nullable: true } )
    productId: number

  @CreateDateColumn()
    created_at: Date

  @UpdateDateColumn()
    updated_at: Date
}
