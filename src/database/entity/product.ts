import { Entity, Column, BaseEntity, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
import { Stock } from "./stock";

@Entity({ name: 'product' })
export class Product extends BaseEntity {

  @Column({unique: true})
  sku: string;

  @Column({ unique: true })
  name: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

}