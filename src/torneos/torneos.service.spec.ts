import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { TorneosService } from './torneos.service';
import { PrismaService } from '../prisma/prisma.service';
import { createMockPrismaService } from '../testing/mock-prisma';

describe('TorneosService', () => {
  let service: TorneosService;
  let prisma: ReturnType<typeof createMockPrismaService>;

  beforeEach(async () => {
    prisma = createMockPrismaService();
    const module: TestingModule = await Test.createTestingModule({
      providers: [TorneosService, { provide: PrismaService, useValue: prisma }],
    }).compile();
    service = module.get<TorneosService>(TorneosService);
  });

  describe('create', () => {
    it('debe crear un torneo con lugares_disponibles = capacidad_maxima', async () => {
      const dto = {
        sucursal_id: 1,
        nombre: 'Torneo Abril',
        fecha: '2026-04-25',
        hora_inicio: '09:00',
        hora_fin: '18:00',
        categoria: 'Varonil' as const,
        capacidad_maxima: 16,
      };
      prisma.torneo.create.mockResolvedValue({
        id: 1,
        ...dto,
        lugares_disponibles: 16,
      });

      const result = await service.create(dto);

      expect(result.lugares_disponibles).toBe(16);
      expect(prisma.torneo.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          lugares_disponibles: 16,
          fecha: expect.any(Date),
        }),
      });
    });
  });

  describe('findAll', () => {
    it('debe retornar todos los torneos', async () => {
      prisma.torneo.findMany.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });

    it('debe filtrar por sucursal_id', async () => {
      prisma.torneo.findMany.mockResolvedValue([]);

      await service.findAll(1);

      expect(prisma.torneo.findMany).toHaveBeenCalledWith({
        where: { sucursal_id: 1 },
      });
    });
  });

  describe('findOne', () => {
    it('debe retornar un torneo', async () => {
      prisma.torneo.findUnique.mockResolvedValue({ id: 1 });

      const result = await service.findOne(1);

      expect(result).toEqual({ id: 1 });
    });

    it('debe lanzar NotFoundException si no existe', async () => {
      prisma.torneo.findUnique.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('debe actualizar un torneo', async () => {
      prisma.torneo.findUnique.mockResolvedValue({ id: 1 });
      prisma.torneo.update.mockResolvedValue({ id: 1, capacidad_maxima: 32 });

      const result = await service.update(1, { capacidad_maxima: 32 });

      expect(result.capacidad_maxima).toBe(32);
    });
  });

  describe('remove', () => {
    it('debe eliminar un torneo', async () => {
      prisma.torneo.findUnique.mockResolvedValue({ id: 1 });
      prisma.torneo.delete.mockResolvedValue({ id: 1 });

      const result = await service.remove(1);

      expect(result).toEqual({ id: 1 });
    });
  });
});
