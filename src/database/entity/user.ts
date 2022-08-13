import { Entity, PrimaryGeneratedColumn, Column, OneToMany, BaseEntity, ManyToOne, OneToOne, JoinColumn } from "typeorm";
import { Role } from './role';

@Entity({ name: 'user' })
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true , nullable: true})
  email: string;

  @Column({ unique: true })
  noInduk: string

  @Column()
  name: string;

  @Column()
  password: string;

  @OneToOne(() => Role)
  @JoinColumn()
  role: Role;
}