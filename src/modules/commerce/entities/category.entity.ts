import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Stall } from './stall.entity';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Stall, (stall) => stall.category)
  stalls: Stall[];
}
