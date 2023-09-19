import { Entity, Column, ManyToMany, JoinTable, PrimaryColumn } from 'typeorm';
import { Permission } from './Permission.entity';
import { User } from './User.entity';
import { v4 as uuidv4 } from 'uuid';

@Entity()
export class Role {
  @PrimaryColumn('uuid')
  id: string = uuidv4();

  @Column()
  name: string;

  @ManyToMany(() => Permission, { eager: true })
  @JoinTable()
  permissions?: Permission[];

  @ManyToMany(() => User, { lazy: true })
  @JoinTable()
  users?: User[];
}
