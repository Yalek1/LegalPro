import { Request, Response } from 'express';
import { CaseService } from '../../application/services/case.service';

const service = new CaseService();

export const getCases = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const cases = await service.getAll(user);
    res.json(cases);
  } catch (err: any) {
    res.status(500).json({ error: 'Error al obtener los casos' });
  }
};

export const getCaseById = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const legalCase = await service.getById(+req.params.id, user);
    if (!legalCase) return res.status(404).json({ message: 'Caso no encontrado o acceso denegado' });
    res.json(legalCase);
  } catch (err: any) {
    res.status(500).json({ error: 'Error al obtener el caso' });
  }
};

export const createCase = async (req: Request, res: Response) => {
  try {
    const legalCase = await service.create(req.body);
    res.status(201).json(legalCase);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteCase = async (req: Request, res: Response) => {
  await service.delete(+req.params.id);
  res.status(204).send();
};
