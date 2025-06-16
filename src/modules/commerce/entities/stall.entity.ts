import { Index, Column, ManyToOne, OneToMany, PrimaryGeneratedColumn, Entity } from 'typeorm';

import { Certificate } from './certificate.entity';
import { Category } from './category.entity';
import { Trader } from './trader.entity';
import { Market } from './market.entity';
import { TaxZone } from './taxzone.entity';

@Entity()
@Index(['market', 'number'], { unique: true })
export class Stall {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int' })
  number: number;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  area: number;

  @Column()
  location: string;

  @ManyToOne(() => Market, (market) => market.stalls)
  market: Market;

  @ManyToOne(() => Trader, (trader) => trader.stalls)
  trader: Trader;

  @ManyToOne(() => Category, (category) => category.stalls)
  category: Category;

  @ManyToOne(() => TaxZone, (taxZone) => taxZone.stalls)
  taxZonce: TaxZone;

  @OneToMany(() => Certificate, (cert) => cert.stall)
  certificates: Certificate[];
}
