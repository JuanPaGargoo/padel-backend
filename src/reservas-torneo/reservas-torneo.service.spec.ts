import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { ReservasTorneoService } from './reservas-torneo.service';
import { PrismaService } from '../prisma/prisma.service';
import { createMockPrismaService } from '../testing/mock-prisma';

describe('ReservasTorneoService', () => {
  let service: ReservasTorneoService;
  let prisma: ReturnType<typeof createMockPrismaService>;

  beforeEach(async () => {
    prisma = createMockPrismaService();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReservasTorneoService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();
    service = module.get<ReservasTorneoService>(ReservasTorneoService);
  });

  describe('create', () => {
    const dto = { usuario_id: 1, torneo_id: 1 };

    it('debe crear una reserva y decrementar lugares_disponibles', async () => {
      prisma.torneo.findUnique.mockResolvedValue({
        id: 1,
        lugares_disponibles: 16,
      });
      const reserva = { id: 1, ...dto, status: 'confirmada' };
      prisma.$transaction.mockResolvedValue([reserva, {}]);

      const result = await service.create(dto);

      expect(result).toEqual(reserva);
      expect(prisma.$transaction).toHaveBeenCalled();
    });

    it('debe lanzar NotFoundException si el torneo no existe', async () => {
      prisma.torneo.findUnique.mockResolvedValue(null);

      await expect(service.create(dto)).rejects.toThrow(NotFoundException);
    });

    it('debe lanzar BadRequestException si no hay lugares disponibles', async () => {
      prisma.torneo.findUnique.mockResolvedValue({
        id: 1,
        lugares_disponibles: 0,
      });

      await expect(service.create(dto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('debe retornar todas las reservas de torneo', async () => {
      prisma.reservaTorneo.findMany.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });

    it('debe filtrar por usuario_id', async () => {
      prisma.reservaTorneo.findMany.mockResolvedValue([]);

      await service.findAll(1);

      expect(prisma.reservaTorneo.findMany).toHaveBeenCalledWith({
        where: { usuario_id: 1 },
        include: { torneo: true, usuario: true },
      });
    });
  });

  describe('cancel', () => {
    it('debe cancelar una reserva e incrementar lugares', async () => {
      prisma.reservaTorneo.findUnique.mockResolvedValue({
        id: 1,
        status: 'confirmada',
        torneo_id: 1,
      });
      const updated = { id: 1, status: 'cancelada' };
      prisma.$transaction.mockResolvedValue([updated, {}]);

      const result = await service.cancel(1);

      expect(result.status).toBe('cancelada');
    });

    it('debe lanzar NotFoundException si la reserva no existe', async () => {
      prisma.reservaTorneo.findUnique.mockResolvedValue(null);

      await expect(service.cancel(999)).rejects.toThrow(NotFoundException);
    });

    it('debe lanzar BadRequestException si ya está cancelada', async () => {
      prisma.reservaTorneo.findUnique.mockResolvedValue({
        id: 1,
        status: 'cancelada',
      });

      await expect(service.cancel(1)).rejects.toThrow(BadRequestException);
    });
  });
});
