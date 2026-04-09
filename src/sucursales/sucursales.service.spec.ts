import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { SucursalesService } from './sucursales.service';
import { PrismaService } from '../prisma/prisma.service';
import { createMockPrismaService } from '../testing/mock-prisma';

describe('SucursalesService', () => {
  let service: SucursalesService;
  let prisma: ReturnType<typeof createMockPrismaService>;

  beforeEach(async () => {
    prisma = createMockPrismaService();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SucursalesService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();
    service = module.get<SucursalesService>(SucursalesService);
  });

  describe('create', () => {
    it('debe crear una sucursal', async () => {
      const dto = {
        nombre: 'Sucursal Central',
        direccion: 'Av. Principal 123',
        ciudad: 'Monterrey',
        estado: 'Nuevo León',
        codigo_postal: '64000',
        estudio_id: 1,
      };
      prisma.sucursal.create.mockResolvedValue({ id: 1, ...dto });

      const result = await service.create(dto);

      expect(result).toEqual({ id: 1, ...dto });
      expect(prisma.sucursal.create).toHaveBeenCalledWith({ data: dto });
    });
  });

  describe('findAll', () => {
    it('debe retornar todas las sucursales', async () => {
      prisma.sucursal.findMany.mockResolvedValue([]);

      await service.findAll();

      expect(prisma.sucursal.findMany).toHaveBeenCalledWith({
        where: undefined,
        include: { estudio: true },
      });
    });

    it('debe filtrar por estudio_id', async () => {
      prisma.sucursal.findMany.mockResolvedValue([]);

      await service.findAll(1);

      expect(prisma.sucursal.findMany).toHaveBeenCalledWith({
        where: { estudio_id: 1 },
        include: { estudio: true },
      });
    });
  });

  describe('findOne', () => {
    it('debe retornar una sucursal', async () => {
      const sucursal = { id: 1, nombre: 'Test' };
      prisma.sucursal.findUnique.mockResolvedValue(sucursal);

      const result = await service.findOne(1);

      expect(result).toEqual(sucursal);
    });

    it('debe lanzar NotFoundException si no existe', async () => {
      prisma.sucursal.findUnique.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('debe actualizar una sucursal', async () => {
      prisma.sucursal.findUnique.mockResolvedValue({ id: 1 });
      prisma.sucursal.update.mockResolvedValue({
        id: 1,
        nombre: 'Actualizado',
      });

      const result = await service.update(1, { nombre: 'Actualizado' });

      expect(result.nombre).toBe('Actualizado');
    });
  });

  describe('remove', () => {
    it('debe eliminar una sucursal', async () => {
      prisma.sucursal.findUnique.mockResolvedValue({ id: 1 });
      prisma.sucursal.delete.mockResolvedValue({ id: 1 });

      const result = await service.remove(1);

      expect(result).toEqual({ id: 1 });
    });
  });
});
