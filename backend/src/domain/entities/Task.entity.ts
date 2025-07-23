import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Case } from './Case.entity';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  description?: string;

  @Column()
  assignedTo?: string;

  @Column({ default: 'pendiente' })
  status?: string;

  @Column({ type: 'date' })
  dueDate?: Date;

  @Column({ nullable: true })
  evidenceUrl?: string;

  @ManyToOne(() => Case, (legalCase) => legalCase.tasks)
  legalCase?: Case;

  @CreateDateColumn()
  createdAt?: Date;
}
