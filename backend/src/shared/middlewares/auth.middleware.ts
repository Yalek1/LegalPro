import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const verifyToken = (roles: string[] = []) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token requerido' });
    }

    try {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'jwtsecret') as any;

      if (roles.length > 0 && !roles.includes(decoded.role)) {
        return res.status(403).json({ error: 'No autorizado' });
      }

      (req as any).user = decoded;
      next();
    } catch (err) {
      return res.status(401).json({ error: 'Token inválido' });
    }
  };
};
