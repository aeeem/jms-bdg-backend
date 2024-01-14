import {
  Entity, PrimaryGeneratedColumn, Column, BaseEntity, JoinColumn, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn
} from 'typeorm'
import { Role } from './role'
import { Transaction } from './transaction'
import { Opname } from './opname'

@Entity( { name: 'user' } )
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
    id: number

  @Column( { unique: true, nullable: true } )
    email?: string

  @Column( { unique: true, nullable: true } )
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
  
  @OneToMany( () => Opname, opname => opname.operator )
    opnames: Opname[]

  @CreateDateColumn()
    created_at: Date

  @UpdateDateColumn()
    updated_at: Date
}
