import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { ReservasCanchaService } from './reservas-cancha.service';
import { PrismaService } from '../prisma/prisma.service';
import { createMockPrismaService } from '../testing/mock-prisma';

describe('ReservasCanchaService', () => {
  let service: ReservasCanchaService;
  let prisma: ReturnType<typeof createMockPrismaService>;

  beforeEach(async () => {
    prisma = createMockPrismaService();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReservasCanchaService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();
    service = module.get<ReservasCanchaService>(ReservasCanchaService);
  });

  describe('create', () => {
    const dto = {
      usuario_id: 1,
      cancha_id: 1,
      fecha: '2026-04-20',
      hora_inicio: '14:00',
      hora_fin: '15:00',
      duracion_min: '60' as const,
    };

    it('debe crear una reserva de cancha', async () => {
      prisma.cancha.findUnique.mockResolvedValue({ id: 1 });
      prisma.reservaCancha.findFirst.mockResolvedValue(null);
      prisma.reservaCancha.create.mockResolvedValue({
        id: 1,
        ...dto,
        status: 'confirmada',
      });

      const result = await service.create(dto);

      expect(result.status).toBe('confirmada');
      expect(prisma.reservaCancha.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          usuario_id: 1,
          cancha_id: 1,
          duracion_min: 'SIXTY',
          status: 'confirmada',
        }),
      });
    });

    it('debe lanzar NotFoundException si la cancha no existe', async () => {
      prisma.cancha.findUnique.mockResolvedValue(null);

      await expect(service.create(dto)).rejects.toThrow(NotFoundException);
    });

    it('debe lanzar BadRequestException si hay conflicto de horario', async () => {
      prisma.cancha.findUnique.mockResolvedValue({ id: 1 });
      prisma.reservaCancha.findFirst.mockResolvedValue({ id: 2 });

      await expect(service.create(dto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('debe retornar todas las reservas de cancha', async () => {
      prisma.reservaCancha.findMany.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });

    it('debe filtrar por usuario_id', async () => {
      prisma.reservaCancha.findMany.mockResolvedValue([]);

      await service.findAll(1);

      expect(prisma.reservaCancha.findMany).toHaveBeenCalledWith({
        where: { usuario_id: 1 },
        include: { cancha: true, usuario: true },
      });
    });
  });

  describe('findOne', () => {
    it('debe retornar una reserva de cancha', async () => {
      prisma.reservaCancha.findUnique.mockResolvedValue({ id: 1 });

      const result = await service.findOne(1);

      expect(result).toEqual({ id: 1 });
    });

    it('debe lanzar NotFoundException si no existe', async () => {
      prisma.reservaCancha.findUnique.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('cancel', () => {
    it('debe cancelar una reserva de cancha', async () => {
      prisma.reservaCancha.findUnique.mockResolvedValue({
        id: 1,
        status: 'confirmada',
      });
      prisma.reservaCancha.update.mockResolvedValue({
        id: 1,
        status: 'cancelada',
      });

      const result = await service.cancel(1);

      expect(result.status).toBe('cancelada');
    });

    it('debe lanzar NotFoundException si la reserva no existe', async () => {
      prisma.reservaCancha.findUnique.mockResolvedValue(null);

      await expect(service.cancel(999)).rejects.toThrow(NotFoundException);
    });

    it('debe lanzar BadRequestException si ya está cancelada', async () => {
      prisma.reservaCancha.findUnique.mockResolvedValue({
        id: 1,
        status: 'cancelada',
      });

      await expect(service.cancel(1)).rejects.toThrow(BadRequestException);
    });
  });
});
