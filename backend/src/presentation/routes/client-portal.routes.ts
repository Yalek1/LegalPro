import { Router } from 'express';
import { getMyCases } from '../controllers/client-portal.controller';
import { verifyToken } from '../../shared/middlewares/auth.middleware';

const router = Router();

// Solo clientes pueden acceder
router.get('/my-cases', verifyToken(['cliente']), getMyCases);

export default router;
