import {
  Entity, Column, BaseEntity, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn, OneToMany
} from 'typeorm'
import { Stock } from './stock'

@Entity( { name: 'product' } )
export class Product extends BaseEntity {
  @PrimaryGeneratedColumn()
    id: number

  @Column( { unique: true } )
    sku: string

  @Column( { unique: true } )
    name: string

  @Column( { nullable: true } )
    arrival_date: Date

  @OneToMany( () => Stock, stock => stock.product, { cascade: true } )
    stocks: Stock[]

  @CreateDateColumn()
    created_at: Date

  @UpdateDateColumn()
    updated_at: Date
}
