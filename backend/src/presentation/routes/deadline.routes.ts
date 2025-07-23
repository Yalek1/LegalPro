import { Router } from 'express';
import {
  createDeadline,
  listDeadlinesByCase,
} from '../controllers/deadline.controller';
import { verifyToken } from '../../shared/middlewares/auth.middleware';

const router = Router();

router.post('/:caseId', verifyToken(['admin', 'abogado']), createDeadline);
router.get('/:caseId', verifyToken(['admin', 'abogado']), listDeadlinesByCase);

export default router;
