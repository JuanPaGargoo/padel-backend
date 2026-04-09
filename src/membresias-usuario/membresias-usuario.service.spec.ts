import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { MembresiasUsuarioService } from './membresias-usuario.service';
import { PrismaService } from '../prisma/prisma.service';
import { createMockPrismaService } from '../testing/mock-prisma';

describe('MembresiasUsuarioService', () => {
  let service: MembresiasUsuarioService;
  let prisma: ReturnType<typeof createMockPrismaService>;

  beforeEach(async () => {
    prisma = createMockPrismaService();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MembresiasUsuarioService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();
    service = module.get<MembresiasUsuarioService>(MembresiasUsuarioService);
  });

  describe('create', () => {
    const dto = {
      usuario_id: 1,
      plan_id: 1,
      fecha_inicio: '2026-04-01',
      fecha_fin: '2026-05-01',
    };

    it('debe crear una membresía con datos del plan', async () => {
      const plan = { id: 1, clases_incluidas: 8, torneos_incluidos: 2 };
      prisma.planMembresia.findUnique.mockResolvedValue(plan);
      prisma.membresiaUsuario.create.mockResolvedValue({ id: 1, ...dto });

      await service.create(dto);

      expect(prisma.membresiaUsuario.create).toHaveBeenCalledWith({
        data: {
          usuario_id: 1,
          plan_id: 1,
          fecha_inicio: expect.any(Date),
          fecha_fin: expect.any(Date),
          status: 'activo',
          clases_restantes: 8,
          torneos_restantes: 2,
        },
      });
    });

    it('debe lanzar NotFoundException si el plan no existe', async () => {
      prisma.planMembresia.findUnique.mockResolvedValue(null);

      await expect(service.create(dto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('debe retornar todas las membresías', async () => {
      prisma.membresiaUsuario.findMany.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });

    it('debe filtrar por usuario_id', async () => {
      prisma.membresiaUsuario.findMany.mockResolvedValue([]);

      await service.findAll(1);

      expect(prisma.membresiaUsuario.findMany).toHaveBeenCalledWith({
        where: { usuario_id: 1 },
        include: { plan: true, usuario: true },
      });
    });
  });

  describe('findOne', () => {
    it('debe retornar una membresía', async () => {
      prisma.membresiaUsuario.findUnique.mockResolvedValue({ id: 1 });

      const result = await service.findOne(1);

      expect(result).toEqual({ id: 1 });
    });

    it('debe lanzar NotFoundException si no existe', async () => {
      prisma.membresiaUsuario.findUnique.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('debe actualizar una membresía', async () => {
      prisma.membresiaUsuario.findUnique.mockResolvedValue({ id: 1 });
      prisma.membresiaUsuario.update.mockResolvedValue({
        id: 1,
        status: 'inactivo',
      });

      const result = await service.update(1, { status: 'inactivo' });

      expect(result.status).toBe('inactivo');
    });
  });

  describe('remove', () => {
    it('debe eliminar una membresía', async () => {
      prisma.membresiaUsuario.findUnique.mockResolvedValue({ id: 1 });
      prisma.membresiaUsuario.delete.mockResolvedValue({ id: 1 });

      const result = await service.remove(1);

      expect(result).toEqual({ id: 1 });
    });
  });
});
