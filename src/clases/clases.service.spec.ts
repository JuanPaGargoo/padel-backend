import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ClasesService } from './clases.service';
import { PrismaService } from '../prisma/prisma.service';
import { createMockPrismaService } from '../testing/mock-prisma';

describe('ClasesService', () => {
  let service: ClasesService;
  let prisma: ReturnType<typeof createMockPrismaService>;

  beforeEach(async () => {
    prisma = createMockPrismaService();
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClasesService, { provide: PrismaService, useValue: prisma }],
    }).compile();
    service = module.get<ClasesService>(ClasesService);
  });

  describe('create', () => {
    it('debe crear una clase con capacidad_actual en 0', async () => {
      const dto = {
        sucursal_id: 1,
        coach_id: 1,
        cancha_id: 1,
        tipo: 'Principiante' as const,
        fecha: '2026-04-20',
        hora_inicio: '10:00',
        hora_fin: '11:00',
        capacidad_maxima: 8,
      };
      prisma.clase.create.mockResolvedValue({
        id: 1,
        ...dto,
        capacidad_actual: 0,
      });

      const result = await service.create(dto);

      expect(result.capacidad_actual).toBe(0);
      expect(prisma.clase.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          capacidad_actual: 0,
          fecha: expect.any(Date),
        }),
      });
    });
  });

  describe('findAll', () => {
    it('debe retornar todas las clases', async () => {
      prisma.clase.findMany.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });

    it('debe filtrar por sucursal_id', async () => {
      prisma.clase.findMany.mockResolvedValue([]);

      await service.findAll(1);

      expect(prisma.clase.findMany).toHaveBeenCalledWith({
        where: { sucursal_id: 1 },
        include: { coach: true, cancha: true },
      });
    });

    it('debe filtrar por tipo', async () => {
      prisma.clase.findMany.mockResolvedValue([]);

      await service.findAll(undefined, undefined, 'Principiante');

      expect(prisma.clase.findMany).toHaveBeenCalledWith({
        where: { tipo: 'Principiante' },
        include: { coach: true, cancha: true },
      });
    });
  });

  describe('findOne', () => {
    it('debe retornar una clase', async () => {
      prisma.clase.findUnique.mockResolvedValue({ id: 1 });

      const result = await service.findOne(1);

      expect(result).toEqual({ id: 1 });
    });

    it('debe lanzar NotFoundException si no existe', async () => {
      prisma.clase.findUnique.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('debe actualizar una clase', async () => {
      prisma.clase.findUnique.mockResolvedValue({ id: 1 });
      prisma.clase.update.mockResolvedValue({ id: 1, capacidad_maxima: 10 });

      const result = await service.update(1, { capacidad_maxima: 10 });

      expect(result.capacidad_maxima).toBe(10);
    });
  });

  describe('remove', () => {
    it('debe eliminar una clase', async () => {
      prisma.clase.findUnique.mockResolvedValue({ id: 1 });
      prisma.clase.delete.mockResolvedValue({ id: 1 });

      const result = await service.remove(1);

      expect(result).toEqual({ id: 1 });
    });
  });
});
