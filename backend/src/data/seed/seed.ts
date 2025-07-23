import { AppDataSource } from '../../config/data-source';
import { User } from '../../domain/entities/User.entity';
import { Client } from '../../domain/entities/Client.entity';
import { Case } from '../../domain/entities/Case.entity';
import { Task } from '../../domain/entities/Task.entity';
import { Deadline } from '../../domain/entities/Deadline.entity';
import { seedUsers, seedClients } from './data';
import bcrypt from 'bcryptjs';

async function runSeed() {
  await AppDataSource.initialize();
  console.log('📦 Base de datos conectada');

  const userRepo = AppDataSource.getRepository(User);
  const clientRepo = AppDataSource.getRepository(Client);
  const caseRepo = AppDataSource.getRepository(Case);
  const taskRepo = AppDataSource.getRepository(Task);
  const deadlineRepo = AppDataSource.getRepository(Deadline);

  // Crear usuarios
  for (const u of seedUsers) {
    const exists = await userRepo.findOneBy({ email: u.email });
    if (!exists) {
      const newUser = userRepo.create({ ...u, password: await bcrypt.hash(u.password, 10) });
      await userRepo.save(newUser);
    }
  }

  // Crear clientes
  const savedClients: Client[] = [];
  for (const c of seedClients) {
    const client = clientRepo.create(c);
    const saved = await clientRepo.save(client);
    savedClients.push(saved);
  }

  // Vincular usuarios con clientes por email
  for (const client of savedClients) {
    const matchingUser = await userRepo.findOneBy({ email: client.email });
    if (matchingUser) {
      matchingUser.client = client;
      await userRepo.save(matchingUser);
    }
  }

  // Crear caso para Carlos Pérez
  const carlosClient = savedClients.find(c => c.email === 'cliente1@legalpro.com');
  if (carlosClient) {
    const case1 = caseRepo.create({
      referenceCode: 'CASE-1001',
      caseType: 'Familiar',
      startDate: new Date('2025-06-01'),
      details: 'Divorcio con custodia',
      client: carlosClient,
    });
    const savedCase1 = await caseRepo.save(case1);

    await taskRepo.save([
      taskRepo.create({
        description: 'Revisión de documentos',
        assignedTo: 'Abogado Uno',
        dueDate: new Date('2025-07-25'),
        legalCase: savedCase1,
      }),
      taskRepo.create({
        description: 'Preparar audiencia',
        assignedTo: 'Abogado Uno',
        dueDate: new Date('2025-07-30'),
        legalCase: savedCase1,
      }),
    ]);

    await deadlineRepo.save([
      deadlineRepo.create({
        title: 'Audiencia Inicial',
        dueDate: new Date('2025-08-01'),
        description: 'Audiencia con juez de familia',
        legalCase: savedCase1,
      }),
      deadlineRepo.create({
        title: 'Presentación de pruebas',
        dueDate: new Date('2025-08-10'),
        description: 'Entrega de documentos legales',
        legalCase: savedCase1,
      }),
    ]);
  }

  // Crear caso para Lucía Gómez
  const luciaClient = savedClients.find(c => c.email === 'lucia.gomez@mail.com');
  if (luciaClient) {
    const case2 = caseRepo.create({
      referenceCode: 'CASE-1002',
      caseType: 'Laboral',
      startDate: new Date('2025-06-10'),
      details: 'Despido injustificado',
      client: luciaClient,
    });
    await caseRepo.save(case2);
  }

  console.log('✅ Datos de prueba insertados correctamente');
  process.exit(0);
}

runSeed().catch((err) => {
  console.error('❌ Error en el seed:', err);
  process.exit(1);
});
