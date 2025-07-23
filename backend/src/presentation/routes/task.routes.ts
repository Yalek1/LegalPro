import { Router } from 'express';
import {
  createTask,
  listTasksByCase,
  markTaskAsCompleted,
  addEvidenceToTask,
} from '../controllers/task.controller';
import { verifyToken } from '../../shared/middlewares/auth.middleware';

const router = Router();

router.post('/:caseId', verifyToken(['admin', 'abogado']), createTask);
router.get('/:caseId', verifyToken(['admin', 'abogado']), listTasksByCase);
router.patch('/complete/:id', verifyToken(['admin', 'abogado']), markTaskAsCompleted);
router.patch('/evidence/:id', verifyToken(['admin', 'abogado']), addEvidenceToTask);

export default router;
