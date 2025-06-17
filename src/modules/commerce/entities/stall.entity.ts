import { Index, Column, ManyToOne, OneToMany, PrimaryGeneratedColumn, Entity, CreateDateColumn } from 'typeorm';

import { Certificate } from './certificate.entity';
import { Category } from './category.entity';
import { Trader } from './trader.entity';
import { Market } from './market.entity';
import { TaxZone } from './taxzone.entity';

@Entity()
@Index(['market', 'number', 'category'], { unique: true })
export class Stall {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int' })
  number: number;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  area: number;

  @Column()
  location: string;

  @ManyToOne(() => Market, (market) => market.stalls, { eager: true })
  market: Market;

  @ManyToOne(() => Trader, (trader) => trader.stalls)
  trader: Trader;

  @ManyToOne(() => Category, (category) => category.stalls, { eager: true })
  category: Category;

  @ManyToOne(() => TaxZone, (taxZone) => taxZone.stalls, { eager: true })
  taxZone: TaxZone;

  @OneToMany(() => Certificate, (cert) => cert.stall)
  certificates: Certificate[];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
