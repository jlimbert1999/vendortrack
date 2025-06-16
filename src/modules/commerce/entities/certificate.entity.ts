import { Entity, Column, ManyToOne, CreateDateColumn, PrimaryGeneratedColumn } from 'typeorm';

import { Trader } from './trader.entity';
import { Stall } from './stall.entity';

export enum PaymentMethod {
  CASH = 'cash',
  TRANSFER = 'transfer',
}

@Entity()
export class Certificate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int', unique: true })
  code: number;

  @ManyToOne(() => Trader, (trader) => trader.certificates)
  trader: Trader;

  @ManyToOne(() => Stall, (stall) => stall.certificates)
  stall: Stall;

  @Column({
    type: 'enum',
    default: 'cash',
    enum: PaymentMethod,
  })
  paymentMethod: PaymentMethod;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @Column({ type: 'timestamptz' })
  startDate: Date;

  @Column({ type: 'timestamptz' })
  endDate: Date;
}
