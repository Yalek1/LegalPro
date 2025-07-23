import { AppDataSource } from '../../config/data-source';
import { Task } from '../../domain/entities/Task.entity';
import { Case } from '../../domain/entities/Case.entity';

export class TaskService {
  private taskRepo = AppDataSource.getRepository(Task);
  private caseRepo = AppDataSource.getRepository(Case);

  async create(caseId: number, data: Partial<Task>) {
    const legalCase = await this.caseRepo.findOneBy({ id: caseId });
    if (!legalCase) throw new Error('Caso no encontrado');

    const task = this.taskRepo.create({ ...data, legalCase });
    return await this.taskRepo.save(task);
  }

  async listByCase(caseId: number) {
    return await this.taskRepo.find({
      where: { legalCase: { id: caseId } },
      order: { dueDate: 'ASC' },
    });
  }

  async markAsCompleted(id: number) {
    const task = await this.taskRepo.findOneBy({ id });
    if (!task) throw new Error('Tarea no encontrada');
    task.status = 'completada';
    return await this.taskRepo.save(task);
  }

  async addEvidence(id: number, url: string) {
    const task = await this.taskRepo.findOneBy({ id });
    if (!task) throw new Error('Tarea no encontrada');
    task.evidenceUrl = url;
    return await this.taskRepo.save(task);
  }
}
