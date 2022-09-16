import {
  BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn
} from 'typeorm'
import { Customer } from './customer'
import { CustomerMonetary } from './customerMonetary'
import { TransactionDetail } from './transactionDetail'

@Entity( { name: 'transaction' } )
export class Transaction extends BaseEntity {
  @PrimaryGeneratedColumn()
    id: number

  @Column()
    expected_total_price: number

  @Column()
    actual_total_price: number

  @Column( { nullable: true } )
    amount_paid: number

  @Column( { nullable: true } )
    change: number

  @Column( { nullable: true } )
    outstanding_amount: number

  @ManyToOne( () => Customer, ( customer: Customer ) => customer.id, { onDelete: 'CASCADE' } )
  @JoinColumn( { name: 'customer_id' } )
    customer: Customer

  @OneToMany( () => TransactionDetail, ( transactionDetail: TransactionDetail ) => transactionDetail.transaction, {
    cascade: true, onDelete: 'CASCADE', eager: true
  } )
  @JoinColumn()
    transactionDetails: TransactionDetail[]

  @Column()
    status: string

  @Column( { nullable: true } )
    customer_id: number

  @Column( {
    type: 'timestamp', default: () => 'now()', nullable: true
  } )
    transaction_date?: Date

  @OneToMany( () => CustomerMonetary, ( customerMonetary: CustomerMonetary ) => customerMonetary.transaction, { onDelete: 'CASCADE' } )
  @JoinColumn()
    customerMonetary: CustomerMonetary[]

  @CreateDateColumn()
    created_at: Date

  @UpdateDateColumn()
    updated_at: Date
}
