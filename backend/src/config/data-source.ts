import { DataSource } from 'typeorm';
import { Case } from '../domain/entities/Case.entity';
import { Client } from '../domain/entities/Client.entity';
import { User } from '../domain/entities/User.entity';
import { Task } from '../domain/entities/Task.entity';
import { Deadline } from '../domain/entities/Deadline.entity';
import { Notification } from '../domain/entities/Notification.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: +(process.env.DB_PORT || 5432),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'sglpweb',
  synchronize: true,
  logging: false,
  entities: [Case, Client, User, Task, Deadline, Notification],
  migrations: [],
  subscribers: [],
});
