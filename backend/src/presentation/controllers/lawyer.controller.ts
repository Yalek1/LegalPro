import { Request, Response } from 'express';
import { AppDataSource } from '../../config/data-source';
import { User } from '../../domain/entities/User.entity';

export const getLawyers = async (_req: Request, res: Response) => {
  try {
    const userRepo = AppDataSource.getRepository(User);
    const lawyers = await userRepo.find({
      where: { role: 'abogado' },
      select: ['id', 'name', 'email'],
    });

    res.json(lawyers);
  } catch (err) {
    console.error('Error al obtener abogados', err);
    res.status(500).json({ error: 'Error al obtener abogados' });
  }
};
