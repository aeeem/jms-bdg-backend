import {
  BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn
} from 'typeorm'
import { E_Recievables, E_Recievables_Source } from '../enum/hutangPiutang'
import { Customer } from './customer'

@Entity( 'customer_monetary' )
export class CustomerMonetary extends BaseEntity {
  @PrimaryGeneratedColumn()
    id: number

  @Column( {
    type    : 'enum',
    enum    : E_Recievables,
    nullable: false
  } )
    type: E_Recievables

  @Column()
    amount: number

  @ManyToOne( () => Customer, ( transaction: Customer ) => transaction.monetary, { onDelete: 'CASCADE' } )
  @JoinColumn( { name: 'cusotmer_id' } )
    customer: Customer

  @Column( {
    nullable: true,
    type    : 'enum',
    enum    : E_Recievables_Source
  } )
    source: E_Recievables_Source

  @CreateDateColumn()
    created_at: Date

  @UpdateDateColumn()
    updated_at: Date
}
