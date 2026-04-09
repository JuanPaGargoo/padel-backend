import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { CanchasService } from './canchas.service';
import { PrismaService } from '../prisma/prisma.service';
import { createMockPrismaService } from '../testing/mock-prisma';

describe('CanchasService', () => {
  let service: CanchasService;
  let prisma: ReturnType<typeof createMockPrismaService>;

  beforeEach(async () => {
    prisma = createMockPrismaService();
    const module: TestingModule = await Test.createTestingModule({
      providers: [CanchasService, { provide: PrismaService, useValue: prisma }],
    }).compile();
    service = module.get<CanchasService>(CanchasService);
  });

  describe('create', () => {
    it('debe crear una cancha', async () => {
      const dto = {
        nombre: 'Cancha 1',
        descripcion: 'Cancha techada',
        hora_apertura: '08:00',
        hora_cierre: '22:00',
        total_slots: 14,
        sucursal_id: 1,
      };
      prisma.cancha.create.mockResolvedValue({ id: 1, ...dto });

      const result = await service.create(dto);

      expect(result).toEqual({ id: 1, ...dto });
    });
  });

  describe('findAll', () => {
    it('debe retornar todas las canchas', async () => {
      prisma.cancha.findMany.mockResolvedValue([]);

      await service.findAll();

      expect(prisma.cancha.findMany).toHaveBeenCalledWith({
        where: undefined,
      });
    });

    it('debe filtrar por sucursal_id', async () => {
      prisma.cancha.findMany.mockResolvedValue([]);

      await service.findAll(1);

      expect(prisma.cancha.findMany).toHaveBeenCalledWith({
        where: { sucursal_id: 1 },
      });
    });
  });

  describe('findOne', () => {
    it('debe retornar una cancha', async () => {
      prisma.cancha.findUnique.mockResolvedValue({ id: 1 });

      const result = await service.findOne(1);

      expect(result).toEqual({ id: 1 });
    });

    it('debe lanzar NotFoundException si no existe', async () => {
      prisma.cancha.findUnique.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('debe actualizar una cancha', async () => {
      prisma.cancha.findUnique.mockResolvedValue({ id: 1 });
      prisma.cancha.update.mockResolvedValue({ id: 1, nombre: 'Actualizada' });

      const result = await service.update(1, { nombre: 'Actualizada' });

      expect(result.nombre).toBe('Actualizada');
    });
  });

  describe('remove', () => {
    it('debe eliminar una cancha', async () => {
      prisma.cancha.findUnique.mockResolvedValue({ id: 1 });
      prisma.cancha.delete.mockResolvedValue({ id: 1 });

      const result = await service.remove(1);

      expect(result).toEqual({ id: 1 });
    });
  });
});
