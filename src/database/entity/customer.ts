import { BaseEntity, Column, Entity } from "typeorm";

@Entity({ name: "customer" })
export class Customer extends BaseEntity {
  @Column()
  id: number;

  @Column()
  name: string;

  @Column()
  contact_number: string;

  @Column()
  created_at: Date;

  @Column()
  updated_at: Date;
}