import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Case } from './Case.entity';

@Entity()
export class Deadline {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  title?: string; // audiencia, presentación, contrato, etc.

  @Column({ type: 'date' })
  dueDate?: Date;

  @Column({ type: 'text' })
  description?: string;

  @ManyToOne(() => Case, (legalCase) => legalCase.deadlines)
  legalCase?: Case;

  @CreateDateColumn()
  createdAt?: Date;
}
