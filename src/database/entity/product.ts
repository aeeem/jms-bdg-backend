import { Entity, PrimaryGeneratedColumn, Column, OneToMany, BaseEntity } from "typeorm";

@Entity({ name: 'product' })
export class Product extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

}