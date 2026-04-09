import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { EstudiosService } from './estudios.service';
import { PrismaService } from '../prisma/prisma.service';
import { createMockPrismaService } from '../testing/mock-prisma';

describe('EstudiosService', () => {
  let service: EstudiosService;
  let prisma: ReturnType<typeof createMockPrismaService>;

  beforeEach(async () => {
    prisma = createMockPrismaService();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EstudiosService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();
    service = module.get<EstudiosService>(EstudiosService);
  });

  describe('create', () => {
    it('debe crear un estudio', async () => {
      const dto = {
        nombre: 'Pádel One',
        logo_url: 'https://logo.com/logo.png',
      };
      prisma.estudio.create.mockResolvedValue({ id: 1, ...dto });

      const result = await service.create(dto);

      expect(result).toEqual({ id: 1, ...dto });
      expect(prisma.estudio.create).toHaveBeenCalledWith({ data: dto });
    });
  });

  describe('findAll', () => {
    it('debe retornar todos los estudios con sucursales', async () => {
      const estudios = [{ id: 1, nombre: 'Test', sucursales: [] }];
      prisma.estudio.findMany.mockResolvedValue(estudios);

      const result = await service.findAll();

      expect(result).toEqual(estudios);
      expect(prisma.estudio.findMany).toHaveBeenCalledWith({
        include: { sucursales: true },
      });
    });
  });

  describe('findOne', () => {
    it('debe retornar un estudio con sucursales', async () => {
      const estudio = { id: 1, nombre: 'Test', sucursales: [] };
      prisma.estudio.findUnique.mockResolvedValue(estudio);

      const result = await service.findOne(1);

      expect(result).toEqual(estudio);
    });

    it('debe lanzar NotFoundException si no existe', async () => {
      prisma.estudio.findUnique.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('debe actualizar un estudio', async () => {
      prisma.estudio.findUnique.mockResolvedValue({ id: 1 });
      prisma.estudio.update.mockResolvedValue({ id: 1, nombre: 'Actualizado' });

      const result = await service.update(1, { nombre: 'Actualizado' });

      expect(result.nombre).toBe('Actualizado');
    });

    it('debe lanzar NotFoundException si no existe', async () => {
      prisma.estudio.findUnique.mockResolvedValue(null);

      await expect(service.update(999, {})).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('debe eliminar un estudio', async () => {
      prisma.estudio.findUnique.mockResolvedValue({ id: 1 });
      prisma.estudio.delete.mockResolvedValue({ id: 1 });

      const result = await service.remove(1);

      expect(result).toEqual({ id: 1 });
    });

    it('debe lanzar NotFoundException si no existe', async () => {
      prisma.estudio.findUnique.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});
