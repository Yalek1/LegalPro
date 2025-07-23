import { Request, Response } from 'express';
import { ClientPortalService } from '../../application/services/client-portal.service';

const service = new ClientPortalService();

export const getMyCases = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const cases = await service.getMyCases(userId);
    res.json(cases);
  } catch (err: any) {
    res.status(404).json({ error: err.message });
  }
};
