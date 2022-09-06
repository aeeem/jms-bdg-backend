import {
  BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn
} from 'typeorm'
import { Stock } from './stock'

@Entity( { name: 'vendor' } )
export class Vendor extends BaseEntity {
  @PrimaryGeneratedColumn()
    id: number

  @Column( { nullable: true } )
    name?: string

  @Column()
    code!: string

  @Column()
    shipping_cost!: number

  @Column( { nullable: true } )
    pic_name?: string

  @Column( { nullable: true } )
    pic_phone_number?: string

  @OneToMany( () => Stock, ( stock: Stock ) => stock.vendor, { onDelete: 'CASCADE' } )
    stocks: Stock[]

  @Column( { nullable: true } )
    address?: string

  @CreateDateColumn()
    created_at: Date

  @UpdateDateColumn()
    updated_at: Date
}
