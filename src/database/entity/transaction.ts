import {
  BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn
} from 'typeorm'
import { Customer } from './customer'
import { CustomerMonetary } from './customerMonetary'
import { TransactionDetail } from './transactionDetail'
import { User } from './user'

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

  @Column( { nullable: true } )
    optional_discount?: number

  @Column( { nullable: true } )
    description?: string

  @ManyToOne( () => Customer, ( customer: Customer ) => customer.id, { onDelete: 'CASCADE', nullable: true } )
  @JoinColumn( { name: 'customer_id' } )
    customer?: Customer

  @OneToMany( () => TransactionDetail, ( transactionDetail: TransactionDetail ) => transactionDetail.transaction, { cascade: true, onDelete: 'CASCADE' } )
  @JoinColumn()
    transactionDetails: TransactionDetail[]

  @Column( { nullable: true } )
    packaging_cost?: number

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

  @ManyToOne( () => User, user => user.transactions, { nullable: true } )
    cashier?: User

  @CreateDateColumn()
    created_at: Date

  @UpdateDateColumn()
    updated_at: Date
}
