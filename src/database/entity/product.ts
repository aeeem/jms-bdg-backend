import { Entity, Column, BaseEntity, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'product' })
export class Product extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique: true, })
  sku!: string;

  @Column({ unique: true })
  name!: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

}