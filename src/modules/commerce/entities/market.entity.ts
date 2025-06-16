import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Stall } from './stall.entity';

@Entity()
export class Market {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Stall, (stall) => stall.market)
  stalls: Stall[];
}
