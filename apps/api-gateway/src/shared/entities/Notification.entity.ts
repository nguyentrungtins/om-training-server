import {
  Entity,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn
} from 'typeorm';
import { User } from './User.entity';
import { v4 as uuidv4 } from 'uuid';
@Entity()
export class Notification {
  @PrimaryColumn('uuid')
  id: string = uuidv4();

  @Column()
  message?: string;

  @Column({ default: false })
  isRead?: boolean;

  @ManyToOne(() => User, { lazy: true })
  user?: Promise<User>;

  @CreateDateColumn()
  created_at?: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at?: Date;
}
