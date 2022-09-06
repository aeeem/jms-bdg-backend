import {
  Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn
} from 'typeorm'

@Entity( { name: 'scope' } )
export class Scope extends BaseEntity {
  @PrimaryGeneratedColumn()
    id: number

  // CRUD PRODUCT
  @Column( { default: false } )
    read_product: boolean = false

  @Column( { default: false } )
    create_product: boolean

  @Column( { default: false } )
    update_product: boolean

  @Column( { default: false } )
    delete_product: boolean

  // CRUD STOCKS
  @Column( { default: false } )
    read_stock: boolean

  @Column( { default: false } )
    create_stock: boolean

  @Column( { default: false } )
    update_stock: boolean

  @Column( { default: false } )
    delete_stock: boolean

  // CRUD CUSTOMER
  @Column( { default: false } )
    create_customer: boolean

  @Column( { default: false } )
    read_customer: boolean

  @Column( { default: false } )
    update_customer: boolean

  @Column( { default: false } )
    delete_customer: boolean

  // CRUD TRANSACTION
  @Column( { default: false } )
    create_transaction: boolean

  @Column( { default: false } )
    read_transaction: boolean

  @Column( { default: false } )
    update_transaction: boolean

  @Column( { default: false } )
    delete_transaction: boolean

  // CRUD USER
  @Column( { default: false } )
    create_user: boolean

  @Column( { default: false } )
    read_user: boolean

  @Column( { default: false } )
    update_user: boolean

  @Column( { default: false } )
    delete_user: boolean

  // CRUD ROLE
  @Column( { default: false } )
    create_role: boolean

  @Column( { default: false } )
    read_role: boolean

  @Column( { default: false } )
    update_role: boolean

  @Column( { default: false } )
    delete_role: boolean

  // CRUD SCOPE
  @Column( { default: false } )
    create_scope: boolean

  @Column( { default: false } )
    read_scope: boolean

  @Column( { default: false } )
    update_scope: boolean

  @Column( { default: false } )
    delete_scope: boolean

  // CRUD VENDOR
  @Column( { default: false } )
    create_vendor: boolean

  @Column( { default: false } )
    read_vendor: boolean

  @Column( { default: false } )
    update_vendor: boolean

  @Column( { default: false } )
    delete_vendor: boolean

  // CRUD VENDOR
  @Column( { default: false } )
    create_pegawai: boolean

  @Column( { default: false } )
    read_pegawai: boolean

  @Column( { default: false } )
    update_pegawai: boolean

  @Column( { default: false } )
    delete_pegawai: boolean

  @CreateDateColumn()
    created_at: Date

  @UpdateDateColumn()
    updated_at: Date
}
