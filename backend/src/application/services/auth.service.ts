import { AppDataSource } from '../../config/data-source';
import { User } from '../../domain/entities/User.entity';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export class AuthService {
  private repo = AppDataSource.getRepository(User);

  async login(email: string, password: string) {
    const user = await this.repo.findOneBy({ email });
    if (!user) throw new Error('Usuario no encontrado');

    const isMatch = await bcrypt.compare(password, user.password || '');
    if (!isMatch) throw new Error('Contraseña incorrecta');

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || 'jwtsecret',
      { expiresIn: '8h' }
    );

    return { token, user: { id: user.id, name: user.name, role: user.role } };
  }

  async register(data: { name: string; email: string; password: string; role?: string }) {
    const exists = await this.repo.findOneBy({ email: data.email });
    if (exists) throw new Error('Email ya registrado');

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = this.repo.create({ ...data, password: hashedPassword });
    return await this.repo.save(user);
  }
}
