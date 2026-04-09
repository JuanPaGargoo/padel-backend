import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsuariosService } from './usuarios.service';
import { PrismaService } from '../prisma/prisma.service';
import { createMockPrismaService } from '../testing/mock-prisma';

describe('UsuariosService', () => {
  let service: UsuariosService;
  let prisma: ReturnType<typeof createMockPrismaService>;

  beforeEach(async () => {
    prisma = createMockPrismaService();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsuariosService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();
    service = module.get<UsuariosService>(UsuariosService);
  });

  describe('create', () => {
    const dto = {
      nombre: 'Test',
      email: 'test@test.com',
      celular: '123456',
      password: 'password123',
      sucursal_id: 1,
    };

    it('debe crear un usuario con contraseña hasheada', async () => {
      prisma.usuario.findUnique.mockResolvedValue(null);
      prisma.usuario.create.mockResolvedValue({ id: 1, ...dto });

      await service.create(dto);

      expect(prisma.usuario.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          nombre: 'Test',
          email: 'test@test.com',
          celular: '123456',
          sucursal_id: 1,
          contrasena: expect.any(String),
        }),
      });
      // Verificar que la contraseña fue hasheada
      const callData = prisma.usuario.create.mock.calls[0][0].data;
      expect(callData.contrasena).not.toBe('password123');
      const isHashed = await bcrypt.compare('password123', callData.contrasena);
      expect(isHashed).toBe(true);
    });

    it('debe lanzar ConflictException si el email ya existe', async () => {
      prisma.usuario.findUnique.mockResolvedValue({ id: 1 });

      await expect(service.create(dto)).rejects.toThrow(ConflictException);
    });
  });

  describe('findAll', () => {
    it('debe retornar todos los usuarios', async () => {
      const users = [{ id: 1 }, { id: 2 }];
      prisma.usuario.findMany.mockResolvedValue(users);

      const result = await service.findAll();

      expect(result).toEqual(users);
    });

    it('debe filtrar por sucursal_id', async () => {
      prisma.usuario.findMany.mockResolvedValue([]);

      await service.findAll(1);

      expect(prisma.usuario.findMany).toHaveBeenCalledWith({
        where: { sucursal_id: 1 },
      });
    });

    it('debe filtrar por email', async () => {
      prisma.usuario.findMany.mockResolvedValue([]);

      await service.findAll(undefined, 'test@test.com');

      expect(prisma.usuario.findMany).toHaveBeenCalledWith({
        where: { email: 'test@test.com' },
      });
    });
  });

  describe('findOne', () => {
    it('debe retornar un usuario por id', async () => {
      const user = { id: 1, nombre: 'Test' };
      prisma.usuario.findUnique.mockResolvedValue(user);

      const result = await service.findOne(1);

      expect(result).toEqual(user);
    });

    it('debe lanzar NotFoundException si no existe', async () => {
      prisma.usuario.findUnique.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('debe actualizar un usuario', async () => {
      prisma.usuario.findUnique.mockResolvedValue({ id: 1 });
      prisma.usuario.update.mockResolvedValue({ id: 1, nombre: 'Actualizado' });

      const result = await service.update(1, { nombre: 'Actualizado' });

      expect(result.nombre).toBe('Actualizado');
    });

    it('debe lanzar NotFoundException si no existe', async () => {
      prisma.usuario.findUnique.mockResolvedValue(null);

      await expect(service.update(999, {})).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('debe eliminar un usuario', async () => {
      prisma.usuario.findUnique.mockResolvedValue({ id: 1 });
      prisma.usuario.delete.mockResolvedValue({ id: 1 });

      const result = await service.remove(1);

      expect(result).toEqual({ id: 1 });
    });

    it('debe lanzar NotFoundException si no existe', async () => {
      prisma.usuario.findUnique.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});
