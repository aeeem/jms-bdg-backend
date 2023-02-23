import {
  BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn
} from 'typeorm'
import { E_CashFlowCode, E_CashFlowType } from '../enum/cashFlow'
import { Transaction } from './transaction'

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

  @OneToOne( () => Transaction, { nullable: true } )
  @JoinColumn( { name: 'transaction_id' } )
    transaction: Transaction

  @Column( { nullable: true } )
    transaction_id: number

  @Column( { nullable: true } )
    amount: number
    
  @Column( { nullable: true } )
    note: string

  @CreateDateColumn()
    created_at: Date

  @UpdateDateColumn()
    updated_at: Date
}
