import {
  BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn
} from 'typeorm'
import { Product } from './product'
import { Vendor } from './vendor'

@Entity( { name: 'stock' } )
export class Stock extends BaseEntity {
  @PrimaryGeneratedColumn()
    id: number

  @Column()
    total_stock!: number

  @Column()
    buy_price: number

  @Column( { nullable: true } )
    sell_price: number

  @OneToOne( () => Product, { onDelete: 'CASCADE' } )
  @JoinColumn( { name: 'productId' } )
    product: Product

  @Column()
    productId: number

  @ManyToOne( () => Vendor, vendor => vendor.stocks, { onDelete: 'CASCADE' } )
  @JoinColumn( { name: 'vendorId' } )
    vendor: Vendor

  @Column()
    vendorId: number

  @CreateDateColumn()
    created_at: Date

  @UpdateDateColumn()
    updated_at: Date
}
