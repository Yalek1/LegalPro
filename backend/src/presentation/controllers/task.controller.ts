import { Request, Response } from 'express';
import { TaskService } from '../../application/services/task.service';

const service = new TaskService();

export const createTask = async (req: Request, res: Response) => {
  try {
    const caseId = +req.params.caseId;
    const task = await service.create(caseId, req.body);
    res.status(201).json(task);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const listTasksByCase = async (req: Request, res: Response) => {
  const caseId = +req.params.caseId;
  const tasks = await service.listByCase(caseId);
  res.json(tasks);
};

export const markTaskAsCompleted = async (req: Request, res: Response) => {
  try {
    const id = +req.params.id;
    const task = await service.markAsCompleted(id);
    res.json(task);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const addEvidenceToTask = async (req: Request, res: Response) => {
  try {
    const id = +req.params.id;
    const { evidenceUrl } = req.body;
    const task = await service.addEvidence(id, evidenceUrl);
    res.json(task);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};
