import { Entity, Column, ManyToMany, JoinTable, PrimaryColumn } from 'typeorm';
import { Role } from './Role.entity';
import { v4 as uuidv4 } from 'uuid';
@Entity()
export class Permission {
  @PrimaryColumn('uuid')
  id?: string = uuidv4();

  @Column()
  name: string;

  @ManyToMany(() => Role)
  @JoinTable()
  roles?: Role[];
}
