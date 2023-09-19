import { Entity, Column, OneToMany, PrimaryColumn } from 'typeorm';
import { Voyage } from './Voyage.entity';
import { v4 as uuidv4 } from 'uuid';

@Entity()
export class Vessel {
  @PrimaryColumn('uuid')
  id: string = uuidv4();

  @Column()
  name: string;

  @Column()
  code: string;

  @Column()
  type: string;

  @Column()
  capacity: number;

  @Column({ nullable: true })
  manufacturer: string;

  @Column({ nullable: true })
  buildYear: number;

  @Column()
  isActive: boolean;

  @Column({ type: 'jsonb', nullable: true })
  additionalInfo: Record<string, any>;

  @OneToMany(() => Voyage, (voyage) => voyage.vessel)
  voyages: Voyage[];
}
