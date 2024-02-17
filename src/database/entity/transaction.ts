import {
  BaseEntity, BeforeInsert, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn
} from 'typeorm'
import dayjs from 'dayjs'

import { padLeft } from 'src/helper/number'
import { Customer } from './customer'
import { CustomerMonetary } from './customerMonetary'
import { TransactionDetail } from './transactionDetail'
import { User } from './user'

@Entity( { name: 'transaction' } )
export class Transaction extends BaseEntity {
  @BeforeInsert()
  async generateTransactionId () {
    const currentMonth = dayjs().format( 'YYMM' )
    const transactions: Transaction[] = await Transaction.createQueryBuilder( 'transaction' )
      .where( 'extract(month from transaction.transaction_date) = extract(month from NOW()) and extract(year from transaction.transaction_date) = extract(year from now())' )
      .getMany()
    const lengthTransaction = transactions.length
    const padded = padLeft( lengthTransaction + 1, 6 )
    const no_nota = `${currentMonth}${padded}`
    this.transaction_id = no_nota
  }

  @PrimaryGeneratedColumn()
    id: number

  @Column( { nullable: true } )
    transaction_id: string

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

  @Column( { nullable: true } )
    deposit?: number

  @Column( { nullable: true } )
    is_transfer?: boolean

  @Column( { nullable: true } )
    remaining_deposit: number

  @Column( { nullable: true } )
    usage_deposit: number

  @Column( { nullable: true } )
    pay_debt_amount: number

  @CreateDateColumn()
    created_at: Date

  @UpdateDateColumn()
    updated_at: Date

  @Column( { nullable: true } )
    sub_total: number
}
