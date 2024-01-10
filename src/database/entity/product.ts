import {
  Entity, Column, BaseEntity, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn, OneToMany, ManyToOne, JoinColumn, DeleteDateColumn
} from 'typeorm'
import { Stock } from './stock'
import { Vendor } from './vendor'

@Entity( { name: 'product' } )
export class Product extends BaseEntity {
  @PrimaryGeneratedColumn()
    id: number

  @Column( { unique: true } )
    sku: string

  @Column( { unique: false } )
    name: string

  @Column( { nullable: true } )
    arrival_date: Date

  @OneToMany( () => Stock, stock => stock.product, { cascade: true } )
    stocks: Stock[]

  @ManyToOne( () => Vendor, vendor => vendor.products, { onDelete: 'CASCADE' } )
  @JoinColumn( { name: 'vendorId' } )
    vendor: Vendor

  @Column( { nullable: true } )
    vendorId: number

  @CreateDateColumn()
    created_at: Date

  @UpdateDateColumn()
    updated_at: Date

  @DeleteDateColumn( { type: 'timestamp', nullable: true } )
    deleted_at: Date
}
