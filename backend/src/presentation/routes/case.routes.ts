import { Router } from 'express';
import {
  getCases,
  getCaseById,
  createCase,
  deleteCase,
} from '../controllers/case.controller';
import { verifyToken } from '../../shared/middlewares/auth.middleware';

const router = Router();

router.get('/', verifyToken(['admin', 'abogado', 'cliente']), getCases);
router.get('/:id', verifyToken(['admin', 'abogado', 'cliente']), getCaseById);
router.post('/', verifyToken(['admin', 'abogado']), createCase);
router.delete('/:id', verifyToken(['admin']), deleteCase);

export default router;
