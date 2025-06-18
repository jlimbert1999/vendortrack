import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

export enum UserRole {
  ADMIN = 'admin',
  OFFICER = 'officer',
}

@Entity()
export class Users {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  fullName: string;

  @Column({
    array: true,
    type: 'enum',
    enum: UserRole,
    default: [UserRole.OFFICER],
  })
  roles: UserRole[];

  @Column({ unique: true })
  login: string;

  @Column()
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;
}
