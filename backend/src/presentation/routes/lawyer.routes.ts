import { Router } from "express";
import { getLawyers } from "../controllers/lawyer.controller";
import { verifyToken } from '../../shared/middlewares/auth.middleware';

const router = Router();

router.get('/', verifyToken(['admin', 'abogado']), getLawyers);

export default router;
