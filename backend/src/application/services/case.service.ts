import { AppDataSource } from '../../config/data-source';
import { CreateCaseDTO } from '../../domain/dtos/case/create-case.dto';
import { Case } from '../../domain/entities/Case.entity';
import { Client } from '../../domain/entities/Client.entity';
import { User } from '../../domain/entities/User.entity';
import { NotificationService } from './notification.service';

export class CaseService {
  private caseRepo = AppDataSource.getRepository(Case);
  private clientRepo = AppDataSource.getRepository(Client);
  private userRepo = AppDataSource.getRepository(User);
  private notifService = new NotificationService();

  async getAll(user: any) {
    if (user.role === 'cliente') {
      const client = await this.clientRepo.findOne({
        where: { user: { id: user.id } }
      });

      if (!client) return [];

      return this.caseRepo.find({
        where: { client: { id: client.id } },
        relations: ['client'],
        order: { createdAt: 'DESC' }
      });
    }

    // Si no es cliente, devolver todos
    return this.caseRepo.find({
      relations: ['client'],
      order: { createdAt: 'DESC' }
    });
  }

  async getById(id: number, user: any) {
    const foundCase = await this.caseRepo.findOne({
      where: { id },
      relations: ['client'],
    });

    if (!foundCase) return null;

    if (user.role === 'cliente' && foundCase.client?.user?.id !== user.id) {
      return null; // acceso denegado
    }

    return foundCase;
  }

  async create(data: CreateCaseDTO) {
    if (
      !data.referenceCode ||
      !data.caseType ||
      !data.startDate ||
      !data.details ||
      !data.clientId ||
      !data.lawyerId
    ) {
      throw new Error('Todos los campos del caso son obligatorios');
    }

    const client = await this.clientRepo.findOne({
      where: { id: data.clientId },
      relations: ['user'],
    });

    if (!client) throw new Error('Cliente no encontrado');

    const lawyer = await this.userRepo.findOneBy({
      id: data.lawyerId , role: 'abogado' 
    });

    if (!lawyer) throw new Error('Abogado no encontrado');

    const newCase = this.caseRepo.create({
      referenceCode: data.referenceCode.trim(),
      caseType: data.caseType.trim(),
      startDate: new Date(data.startDate),
      details: data.details.trim(),
      client,
      lawyer,
    });

    const saved = await this.caseRepo.save(newCase);

    await this.notifService.create(
      client.user?.id || 0,
      'Nuevo caso registrado',
      `Tu caso con código de referencia "${saved.referenceCode}" ha sido registrado.`
    );

    return saved;
  }

  async delete(id: number) {
    await this.caseRepo.delete(id);
  }
}
