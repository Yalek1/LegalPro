import { Router } from 'express';
import {
  getClients,
  getClientById,
  createClient,
  deleteClient,
} from '../controllers/client.controller';
import { verifyToken } from '../../shared/middlewares/auth.middleware';

const router = Router();

router.get('/', getClients);
router.get('/:id', getClientById);
router.post('/', createClient);
router.delete('/:id', deleteClient);
router.get('/', verifyToken(['admin', 'abogado']), getClients);
router.post('/', verifyToken(['admin']), createClient);

export default router;
