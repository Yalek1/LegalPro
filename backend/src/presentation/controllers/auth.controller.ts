import { Request, Response } from 'express';
import { AppDataSource } from '../../config/data-source';
import { User } from '../../domain/entities/User.entity';
import { Client } from '../../domain/entities/Client.entity';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const userRepo = AppDataSource.getRepository(User);
const clientRepo = AppDataSource.getRepository(Client);

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Correo y contraseña requeridos' });
  }

  try {
    const user = await userRepo.findOne({
      where: { email },
      relations: ['client'],
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const passwordValid = await bcrypt.compare(password, user.password || '');
    if (!passwordValid) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

    if (user.role === 'cliente' && !user.client) {
      return res.status(403).json({ error: 'Cliente no registrado como entidad' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || 'jwtsecret',
      { expiresIn: '10h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        clientId: user.client?.id || null,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const register = async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: 'Todos los campos son requeridos' });
  }

  try {
    const exists = await userRepo.findOneBy({ email });
    if (exists) {
      return res.status(409).json({ error: 'El usuario ya existe' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = userRepo.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    // Si el rol es cliente, crear automáticamente la entidad Client
    if (role === 'cliente') {
      const newClient = clientRepo.create({
        fullName: name,
        email: email,
      });
      const savedClient = await clientRepo.save(newClient);
      newUser.client = savedClient;
    }

    const savedUser = await userRepo.save(newUser);

    res.status(201).json({
      message: 'Usuario creado correctamente',
      user: {
        id: savedUser.id,
        name: savedUser.name,
        email: savedUser.email,
        role: savedUser.role,
        clientId: savedUser.client?.id || null,
      },
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Error al crear el usuario' });
  }
};
