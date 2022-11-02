import {
  BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn
} from 'typeorm'
import { Stock } from './stock'

@Entity( { name: 'stock_gudang' } )
export class StockGudang extends BaseEntity {
  @PrimaryGeneratedColumn()
    id: number

  @Column( { nullable: true } )
    amount!: number

  @Column( { nullable: true } )
    code: string
   
  @ManyToOne( () => Stock, { onDelete: 'CASCADE' } )
  @JoinColumn( { name: 'stock_id' } )
    stock: Stock

  @Column( { nullable: true } )
    stock_id: number

  @CreateDateColumn()
    created_at: Date

  @UpdateDateColumn()
    updated_at: Date
}
