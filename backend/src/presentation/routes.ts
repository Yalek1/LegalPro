import { Router } from 'express';
import clientRoutes from './routes/client.routes';
import caseRoutes from './routes/case.routes';
import authRoutes from './routes/auth.routes';
import taskRoutes from './routes/task.routes';
import deadlineRoutes from './routes/deadline.routes';
import clientPortalRoutes from './routes/client-portal.routes';
import lawyerRoutes from './routes/lawyer.routes';

const router = Router();

router.use('/clients', clientRoutes);
router.use('/cases', caseRoutes);
router.use('/auth', authRoutes);
router.use('/tasks', taskRoutes);
router.use('/deadlines', deadlineRoutes);
router.use('/client-portal', clientPortalRoutes);
router.use('/lawyers', lawyerRoutes);

export default router;
