import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Stall } from './stall.entity';
import { Certificate } from './certificate.entity';

@Entity()
export class Trader {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastNamePaternal: string;

  @Column()
  lastNameMaternal: string;

  @Column({ unique: true })
  dni: string;

  @Column()
  address: string;

  @Column()
  phone: string;

  @Column({ type: 'varchar', nullable: true })
  photo: string | null;

  @Column({ type: 'timestamptz' })
  grantDate: Date;

  @OneToMany(() => Stall, (stall) => stall.trader)
  stalls: Stall[];

  @OneToMany(() => Certificate, (cert) => cert.trader)
  certificates: Certificate[];
}
