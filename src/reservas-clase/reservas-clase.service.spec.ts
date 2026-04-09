import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { ReservasClaseService } from './reservas-clase.service';
import { PrismaService } from '../prisma/prisma.service';
import { createMockPrismaService } from '../testing/mock-prisma';

describe('ReservasClaseService', () => {
  let service: ReservasClaseService;
  let prisma: ReturnType<typeof createMockPrismaService>;

  beforeEach(async () => {
    prisma = createMockPrismaService();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReservasClaseService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();
    service = module.get<ReservasClaseService>(ReservasClaseService);
  });

  describe('create', () => {
    const dto = { usuario_id: 1, clase_id: 1, cantidad_personas: 2 };

    it('debe crear una reserva y actualizar capacidad_actual', async () => {
      const clase = { id: 1, capacidad_maxima: 8, capacidad_actual: 0 };
      prisma.clase.findUnique.mockResolvedValue(clase);
      const reserva = { id: 1, ...dto, status: 'confirmada' };
      prisma.$transaction.mockResolvedValue([reserva, {}]);

      const result = await service.create(dto);

      expect(result).toEqual(reserva);
      expect(prisma.$transaction).toHaveBeenCalled();
    });

    it('debe lanzar NotFoundException si la clase no existe', async () => {
      prisma.clase.findUnique.mockResolvedValue(null);

      await expect(service.create(dto)).rejects.toThrow(NotFoundException);
    });

    it('debe lanzar BadRequestException si no hay cupo', async () => {
      const clase = { id: 1, capacidad_maxima: 8, capacidad_actual: 7 };
      prisma.clase.findUnique.mockResolvedValue(clase);

      await expect(service.create(dto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('debe retornar todas las reservas', async () => {
      prisma.reservaClase.findMany.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });

    it('debe filtrar por usuario_id', async () => {
      prisma.reservaClase.findMany.mockResolvedValue([]);

      await service.findAll(1);

      expect(prisma.reservaClase.findMany).toHaveBeenCalledWith({
        where: { usuario_id: 1 },
        include: { clase: true, usuario: true },
      });
    });
  });

  describe('cancel', () => {
    it('debe cancelar una reserva y decrementar capacidad', async () => {
      const reserva = {
        id: 1,
        status: 'confirmada',
        clase_id: 1,
        cantidad_personas: 2,
      };
      prisma.reservaClase.findUnique.mockResolvedValue(reserva);
      const updated = { ...reserva, status: 'cancelada' };
      prisma.$transaction.mockResolvedValue([updated, {}]);

      const result = await service.cancel(1);

      expect(result.status).toBe('cancelada');
    });

    it('debe lanzar NotFoundException si la reserva no existe', async () => {
      prisma.reservaClase.findUnique.mockResolvedValue(null);

      await expect(service.cancel(999)).rejects.toThrow(NotFoundException);
    });

    it('debe lanzar BadRequestException si ya está cancelada', async () => {
      prisma.reservaClase.findUnique.mockResolvedValue({
        id: 1,
        status: 'cancelada',
      });

      await expect(service.cancel(1)).rejects.toThrow(BadRequestException);
    });
  });
});
