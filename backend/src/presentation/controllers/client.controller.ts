import { Request, Response } from 'express';
import { ClientService } from '../../application/services/client.service';

const service = new ClientService();

export const getClients = async (_req: Request, res: Response) => {
  const clients = await service.getAll();
  res.json(clients);
};

export const getClientById = async (req: Request, res: Response) => {
  const client = await service.getById(+req.params.id);
  if (!client) return res.status(404).json({ message: 'Cliente no encontrado' });
  res.json(client);
};

export const createClient = async (req: Request, res: Response) => {
  const client = await service.create(req.body);
  res.status(201).json(client);
};

export const deleteClient = async (req: Request, res: Response) => {
  await service.delete(+req.params.id);
  res.status(204).send();
};
