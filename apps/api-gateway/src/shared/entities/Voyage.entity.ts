import { Entity, Column, ManyToOne, PrimaryColumn } from 'typeorm';
import { Vessel } from './Vessel.entity';
import { v4 as uuidv4 } from 'uuid';

@Entity()
export class Voyage {
  @PrimaryColumn('uuid')
  id: string = uuidv4();

  @Column()
  departurePort: string;

  @Column()
  arrivalPort: string;

  @Column()
  departureDate: Date;

  @Column()
  arrivalDate: Date;

  @ManyToOne(() => Vessel, (vessel) => vessel.voyages)
  vessel: Vessel;
}
