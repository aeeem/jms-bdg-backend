import {
  Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToOne, JoinColumn
} from 'typeorm'
import { Scope } from './scopes'
import { User } from './user'

@Entity( { name: 'role' } )
export class Role extends BaseEntity {
  @PrimaryGeneratedColumn()
    id: number

  @Column()
    role: string

  @OneToOne( () => Scope )
  @JoinColumn()
    scopes: Scope

<<<<<<< HEAD
  @OneToOne( () => User )
    user: User
}
=======
  // @OneToOne(() => User)
  user: User;
}
>>>>>>> 03cbe24937d30a92e6911a3f0fd2b19652726a69

  @OneToOne( () => User )
    user: User
}