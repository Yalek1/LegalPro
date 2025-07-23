import { Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  OneToOne, 
  JoinColumn, 
  OneToMany,
} from 'typeorm';
import { Client } from './Client.entity';
import { Notification } from './Notification.entity';
import { Case } from './Case.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  name?: string;

  @Column({ unique: true })
  email?: string;

  @Column()
  password?: string;

  @Column({ default: 'cliente' })
  role?: string;

  @OneToOne(() => Client, { cascade: true })
  @JoinColumn()
  client?: Client;

  @OneToMany(() => Notification, (notification) => notification.user)
  notifications?: Notification[];

  @OneToMany(() => Case, legalCase => legalCase.lawyer)
  assignedCases?: Case[];
}
