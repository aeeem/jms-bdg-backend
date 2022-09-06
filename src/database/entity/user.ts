import {
  Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToOne, JoinColumn
} from 'typeorm'
import { Role } from './role'

@Entity( { name: 'user' } )
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
    id: number

  @Column( { unique: true, nullable: true } )
    email: string

  @Column( { unique: true } )
    noInduk: string

  @Column()
    name: string

  @Column( { nullable: true } )
    birth_date: Date

  @Column( { nullable: true } )
    phone_number: string

  @Column()
    password: string

  @OneToOne( () => Role )
  @JoinColumn( { name: 'role_id' } )
    role: Role

  @Column( { nullable: true } )
    role_id: number
}
