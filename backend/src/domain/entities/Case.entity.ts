import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  ManyToOne, 
  OneToMany 
} from 'typeorm';
import { Client } from './Client.entity';
import { Task } from './Task.entity';
import { Deadline } from './Deadline.entity';
import { User } from './User.entity';

@Entity()
export class Case {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  referenceCode?: string;

  @Column()
  caseType?: string;

  @Column()
  startDate?: Date;

  @Column({ type: 'text' })
  details?: string;

  @ManyToOne(() => Client, (client) => client.cases)
  client?: Client;

  @OneToMany(() => Task, (task) => task.legalCase)
  tasks?: Task[];

  @OneToMany(() => Deadline, (deadline) => deadline.legalCase)
  deadlines?: Deadline[];

  @ManyToOne(() => User, user => user.assignedCases, { nullable: true })
  lawyer?: User;
}
