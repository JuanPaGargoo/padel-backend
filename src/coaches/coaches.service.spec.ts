import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { CoachesService } from './coaches.service';
import { PrismaService } from '../prisma/prisma.service';
import { createMockPrismaService } from '../testing/mock-prisma';

describe('CoachesService', () => {
  let service: CoachesService;
  let prisma: ReturnType<typeof createMockPrismaService>;

  beforeEach(async () => {
    prisma = createMockPrismaService();
    const module: TestingModule = await Test.createTestingModule({
      providers: [CoachesService, { provide: PrismaService, useValue: prisma }],
    }).compile();
    service = module.get<CoachesService>(CoachesService);
  });

  describe('create', () => {
    it('debe crear un coach', async () => {
      const dto = {
        nombre: 'Carlos',
        email: 'carlos@test.com',
        sucursal_id: 1,
      };
      prisma.coach.create.mockResolvedValue({ id: 1, ...dto });

      const result = await service.create(dto);

      expect(result).toEqual({ id: 1, ...dto });
    });
  });

  describe('findAll', () => {
    it('debe retornar todos los coaches', async () => {
      prisma.coach.findMany.mockResolvedValue([]);

      await service.findAll();

      expect(prisma.coach.findMany).toHaveBeenCalledWith({
        where: undefined,
      });
    });

    it('debe filtrar por sucursal_id', async () => {
      prisma.coach.findMany.mockResolvedValue([]);

      await service.findAll(1);

      expect(prisma.coach.findMany).toHaveBeenCalledWith({
        where: { sucursal_id: 1 },
      });
    });
  });

  describe('findOne', () => {
    it('debe retornar un coach', async () => {
      prisma.coach.findUnique.mockResolvedValue({ id: 1 });

      const result = await service.findOne(1);

      expect(result).toEqual({ id: 1 });
    });

    it('debe lanzar NotFoundException si no existe', async () => {
      prisma.coach.findUnique.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('debe actualizar un coach', async () => {
      prisma.coach.findUnique.mockResolvedValue({ id: 1 });
      prisma.coach.update.mockResolvedValue({ id: 1, nombre: 'Actualizado' });

      const result = await service.update(1, { nombre: 'Actualizado' });

      expect(result.nombre).toBe('Actualizado');
    });
  });

  describe('remove', () => {
    it('debe eliminar un coach', async () => {
      prisma.coach.findUnique.mockResolvedValue({ id: 1 });
      prisma.coach.delete.mockResolvedValue({ id: 1 });

      const result = await service.remove(1);

      expect(result).toEqual({ id: 1 });
    });
  });
});
