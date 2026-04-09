import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { PlanesMembresiaService } from './planes-membresia.service';
import { PrismaService } from '../prisma/prisma.service';
import { createMockPrismaService } from '../testing/mock-prisma';

describe('PlanesMembresiaService', () => {
  let service: PlanesMembresiaService;
  let prisma: ReturnType<typeof createMockPrismaService>;

  beforeEach(async () => {
    prisma = createMockPrismaService();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlanesMembresiaService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();
    service = module.get<PlanesMembresiaService>(PlanesMembresiaService);
  });

  describe('create', () => {
    it('debe crear un plan de membresía', async () => {
      const dto = {
        nombre: 'Plan Básico',
        clases_incluidas: 8,
        torneos_incluidos: 2,
        permite_cancha: true,
        precio: 1500,
      };
      prisma.planMembresia.create.mockResolvedValue({ id: 1, ...dto });

      const result = await service.create(dto);

      expect(result).toEqual({ id: 1, ...dto });
    });
  });

  describe('findAll', () => {
    it('debe retornar todos los planes', async () => {
      prisma.planMembresia.findMany.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('debe retornar un plan', async () => {
      prisma.planMembresia.findUnique.mockResolvedValue({ id: 1 });

      const result = await service.findOne(1);

      expect(result).toEqual({ id: 1 });
    });

    it('debe lanzar NotFoundException si no existe', async () => {
      prisma.planMembresia.findUnique.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('debe actualizar un plan', async () => {
      prisma.planMembresia.findUnique.mockResolvedValue({ id: 1 });
      prisma.planMembresia.update.mockResolvedValue({ id: 1, precio: 2000 });

      const result = await service.update(1, { precio: 2000 });

      expect(result.precio).toBe(2000);
    });
  });

  describe('remove', () => {
    it('debe eliminar un plan', async () => {
      prisma.planMembresia.findUnique.mockResolvedValue({ id: 1 });
      prisma.planMembresia.delete.mockResolvedValue({ id: 1 });

      const result = await service.remove(1);

      expect(result).toEqual({ id: 1 });
    });
  });
});
