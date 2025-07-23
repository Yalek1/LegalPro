import { AppDataSource } from '../../config/data-source';
import { User } from '../../domain/entities/User.entity';

export class ClientPortalService {
  private userRepo = AppDataSource.getRepository(User);

  async getMyCases(userId: number) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['client', 'client.cases', 'client.cases.tasks', 'client.cases.deadlines'],
    });

    if (!user || !user.client) throw new Error('Este usuario no está vinculado a un cliente');
    return user.client.cases;
  }
}
