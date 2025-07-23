import { Request, Response } from 'express';
import { NotificationService } from '../../application/services/notification.service';

const service = new NotificationService();

export const getUserNotifications = async (req: Request, res: Response) => {
  const user = (req as any).user;
  const notifications = await service.getUserNotifications(user.id);
  res.json(notifications);
};

export const createNotification = async (req: Request, res: Response) => {
  try {
    const { userId, title, message } = req.body;
    const notif = await service.create(userId, title, message);
    res.status(201).json(notif);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const markAsRead = async (req: Request, res: Response) => {
  await service.markAsRead(+req.params.id);
  res.status(204).send();
};
