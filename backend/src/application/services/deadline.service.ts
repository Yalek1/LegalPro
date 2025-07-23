import { AppDataSource } from '../../config/data-source';
import { Deadline } from '../../domain/entities/Deadline.entity';
import { Case } from '../../domain/entities/Case.entity';

export class DeadlineService {
  private deadlineRepo = AppDataSource.getRepository(Deadline);
  private caseRepo = AppDataSource.getRepository(Case);

  async create(caseId: number, data: Partial<Deadline>) {
    const legalCase = await this.caseRepo.findOneBy({ id: caseId });
    if (!legalCase) throw new Error('Caso no encontrado');

    const deadline = this.deadlineRepo.create({ ...data, legalCase });
    return await this.deadlineRepo.save(deadline);
  }

  async listByCase(caseId: number) {
    return await this.deadlineRepo.find({
      where: { legalCase: { id: caseId } },
      order: { dueDate: 'ASC' },
    });
  }
}
