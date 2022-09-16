import { E_CODE_KEY } from 'src/interface/AccountCode'
import {
  BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn
} from 'typeorm'
import { E_Recievables } from '../enum/hutangPiutang'
import { Customer } from './customer'
import { Transaction } from './transaction'

@Entity( 'customer_monetary' )
export class CustomerMonetary extends BaseEntity {
  @PrimaryGeneratedColumn()
    id: number

  @Column( {
    type: 'enum',
    enum: E_Recievables
  } )
    type: E_Recievables

  @Column()
    amount: number
  
  @Column( {
    type: 'enum',
    enum: E_CODE_KEY
  } )
    source: E_CODE_KEY

  @Column( { nullable: true } )
    transaction_id: number

  @Column()
    customer_id: number

  @ManyToOne( () => Customer, ( customer: Customer ) => customer.monetary, { onDelete: 'CASCADE' } )
  @JoinColumn( { name: 'customer_id' } )
    customer: Customer

  @ManyToOne( () => Transaction, ( transaction: Transaction ) => transaction.customerMonetary, { onDelete: 'CASCADE' } )
  @JoinColumn( { name: 'transaction_id' } )
    transaction: Transaction

  @CreateDateColumn()
    created_at: Date

  @UpdateDateColumn()
    updated_at: Date
}
