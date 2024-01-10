import {
  BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn
} from 'typeorm'
import {
  E_CashFlowCode, E_CashFlowType, E_CashType
} from '../enum/cashFlow'
import { Transaction } from './transaction'
import { Customer } from './customer'

@Entity( 'CashFlow' )
export class CashFlow extends BaseEntity {
  @PrimaryGeneratedColumn()
    id: number

  @Column( {
    type: 'enum',
    enum: E_CashFlowCode
  } )
    code: E_CashFlowCode
  
  @Column( {
    type: 'enum',
    enum: E_CashFlowType
  } )
    type: E_CashFlowType

  @Column( { default: E_CashType.CASH } )
    cash_type: string

  @OneToOne( () => Transaction, { nullable: true } )
  @JoinColumn( { name: 'transaction_id' } )
    transaction: Transaction

  @Column( { nullable: true } )
    transaction_id: number

  @Column( { nullable: true } )
    amount: number
    
  @Column( { nullable: true } )
    note: string

  @ManyToOne( () => Customer, { nullable: true } )
  @JoinColumn( { name: 'customer_id' } )
    customer: Customer

  @Column( { nullable: true } )
    customer_id: number

  @CreateDateColumn()
    created_at: Date

  @UpdateDateColumn()
    updated_at: Date
}
