import {
  Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToOne, JoinColumn
} from 'typeorm'
import { StockGudang } from './stockGudang'
import { StockToko } from './stockToko'

@Entity( { name: 'retur' } )
export class Retur extends BaseEntity {
  @PrimaryGeneratedColumn()
    id: number

  @Column()
    type: string

  @OneToOne( () => StockGudang, { nullable: true } )
  @JoinColumn( { name: 'stock_gudang_id' } )
    stockGudang: StockGudang

  @OneToOne( () => StockToko, { nullable: true } )
  @JoinColumn( { name: 'stock_toko_id' } )
    stockToko: StockToko

  @Column()
    amount: number
}
