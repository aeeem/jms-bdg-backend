import { Entity, PrimaryGeneratedColumn, Column, OneToMany, BaseEntity, ManyToOne } from "typeorm";
import { Role } from './role';

@Entity({ name: 'user' })
export class User extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  noInduk: string

  @Column()
  name: string;

  @Column()
  password: string;

  @ManyToOne(() => Role, (role: Role) => role.user, { onDelete: 'CASCADE' })
  roles: Role[];

}