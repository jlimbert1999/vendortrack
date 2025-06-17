import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Stall } from './stall.entity';

@Entity()
export class TaxZone {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Stall, (stall) => stall.taxZone)
  stalls: Stall[];
}
