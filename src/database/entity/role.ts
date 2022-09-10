import {
  Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToOne, JoinColumn
} from 'typeorm'
import { Scope } from './scopes'
import { User } from './user'

@Entity( { name: 'role' } )
export class Role extends BaseEntity {
  @PrimaryGeneratedColumn()
    id: number

  @Column()
    role: string

  @OneToOne( () => Scope )
  @JoinColumn( { name: 'scopesId' } )
    scopes: Scope

  @Column()
    scopesId: number

  @OneToOne( () => User )
    user: User
}
