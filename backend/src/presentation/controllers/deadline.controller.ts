import { Request, Response } from 'express';
import { DeadlineService } from '../../application/services/deadline.service';

const service = new DeadlineService();

export const createDeadline = async (req: Request, res: Response) => {
  try {
    const caseId = +req.params.caseId;
    const deadline = await service.create(caseId, req.body);
    res.status(201).json(deadline);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const listDeadlinesByCase = async (req: Request, res: Response) => {
  const caseId = +req.params.caseId;
  const deadlines = await service.listByCase(caseId);
  res.json(deadlines);
};
