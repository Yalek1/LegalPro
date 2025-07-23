import { AppDataSource } from '../../config/data-source';
import { Notification } from '../../domain/entities/notification.entity';
import { User } from '../../domain/entities/User.entity';

export class NotificationService {
  private repo = AppDataSource.getRepository(Notification);
  private userRepo = AppDataSource.getRepository(User);

  async create(userId: number, title: string, message: string) {
    const user = await this.userRepo.findOneBy({ id: userId });
    if (!user) throw new Error('Usuario no encontrado');

    const notification = this.repo.create({
      title,
      message,
      user,
    });

    return this.repo.save(notification);
  }

  async getUserNotifications(userId: number) {
    return this.repo.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
    });
  }

  async markAsRead(notificationId: number) {
    await this.repo.update({ id: notificationId }, { read: true });
  }
}
