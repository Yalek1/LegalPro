import { AppDataSource } from '../../config/data-source';
import { Client } from '../../domain/entities/Client.entity';
import { User } from '../../domain/entities/User.entity';
import { CreateClientDTO } from '../../domain/dtos/client/create-client.dto';

export class ClientService {
  private repo = AppDataSource.getRepository(Client);
  private userRepo = AppDataSource.getRepository(User);

  async getAll() {
    return await this.repo.find({ relations: ['cases'] });
  }

  async getById(id: number) {
    return await this.repo.findOne({ where: { id }, relations: ['cases'] });
  }

  async create(data: CreateClientDTO) {
    if (!data.name || !data.email || !data.userId) {
      throw new Error('Nombre, correo y userId son obligatorios');
    }

    const user = await this.userRepo.findOneBy({ id: data.userId });
    if (!user) throw new Error('El usuario vinculado no existe');

    const existing = await this.repo.findOneBy({ user: { id: user.id } });
    if (existing) throw new Error('Este usuario ya tiene un cliente asociado');

    const newClient = this.repo.create({
      fullName: data.name.trim(),
      email: data.email.trim(),
      phone: data.phone?.trim(),
      user
    });

    return this.repo.save(newClient);
  }

  async delete(id: number) {
    return await this.repo.delete(id);
  }
}
