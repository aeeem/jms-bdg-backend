import {
  BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn
} from 'typeorm'
import { User } from './user'

@Entity( { name: 'opname' } )
export class Opname extends BaseEntity {
  @PrimaryGeneratedColumn()
    id: number

  @Column( { type: 'jsonb', nullable: true } )
    items: object[]

  @Column( { nullable: true } )
    operator_id: number

  @ManyToOne( () => User, { onDelete: 'CASCADE' } )
  @JoinColumn( { name: 'operator_id' } )
    operator: User

  @CreateDateColumn()
    created_at: Date

  @UpdateDateColumn()
    updated_at: Date
}
