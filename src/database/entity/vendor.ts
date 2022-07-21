import { BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Stock } from "./stock";

@Entity({ name: "vendor" })
export class Vendor extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name!: string;

  @Column()
  pic_name!: string;

  @Column()
  pic_phone_number!: string;

  @OneToMany(() => Stock, (stock: Stock) => stock.vendor, { onDelete: "CASCADE" })
  stocks: Stock[];

  @Column()
  address: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

}