import {
  BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn
} from 'typeorm'

@Entity( { name: 'vendor' } )
export class Vendor extends BaseEntity {
  @PrimaryGeneratedColumn()
    id: number

  @Column( { nullable: true } )
    name?: string

  @Column()
    code!: string

  @Column()
    shipping_cost!: number

  @Column( { nullable: true } )
    pic_name?: string

  @Column( { nullable: true } )
    pic_phone_number?: string

  @Column( { nullable: true } )
    address?: string

  @CreateDateColumn()
    created_at: Date

  @UpdateDateColumn()
    updated_at: Date
}
