import {
  Entity, PrimaryGeneratedColumn, Column, BaseEntity, JoinColumn, ManyToOne, OneToMany
} from 'typeorm'
import { Role } from './role'
import { Transaction } from './transaction'

@Entity( { name: 'user' } )
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
    id: number

  @Column( { unique: true, nullable: true } )
    email?: string

  @Column( { unique: true } )
    noInduk: string

  @Column()
    name: string

  @Column( { nullable: true } )
    birth_date?: Date

  @Column( { nullable: true } )
    phone_number: string

  @Column()
    password: string

  @OneToMany( () => Transaction, transaction => transaction.cashier )
    transactions: Transaction[]

  @ManyToOne( () => Role, ( role: Role ) => role.id, { onDelete: 'CASCADE' } )
  @JoinColumn( { name: 'role_id' } )
    role: Role

  @Column( { nullable: true } )
    role_id: number
}
