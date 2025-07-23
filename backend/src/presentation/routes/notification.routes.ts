import { Router } from 'express';
import {
  getUserNotifications,
  createNotification,
  markAsRead,
} from '../controllers/notification.controller';
import { verifyToken } from '../../shared/middlewares/auth.middleware';

const router = Router();

router.get('/', verifyToken(['admin', 'abogado', 'cliente']), getUserNotifications);
router.post('/', verifyToken(['admin']), createNotification);
router.patch('/:id/read', verifyToken(['admin', 'cliente', 'abogado']), markAsRead);

export default router;
