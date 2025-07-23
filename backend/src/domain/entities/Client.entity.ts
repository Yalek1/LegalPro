import { Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne } from 'typeorm';
import { Case } from './Case.entity';
import { User } from './User.entity';

@Entity()
export class Client {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  fullName?: string;

  @Column()
  email?: string;

  @OneToMany(() => Case, (legalCase) => legalCase.client)
  cases?: Case[];

  @OneToOne(() => User, (user) => user.client)
  user?: User;
}
