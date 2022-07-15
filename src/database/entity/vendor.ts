import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: "vendor" })
export class Vendor extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string;

  @Column()
  pic_name: string;

  @Column()
  pic_phone_number: string;

  @Column()
  address: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

}