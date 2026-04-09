import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { createMockPrismaService } from '../testing/mock-prisma';

describe('AuthService', () => {
  let service: AuthService;
  let prisma: ReturnType<typeof createMockPrismaService>;
  let jwtService: { sign: jest.Mock };

  beforeEach(async () => {
    prisma = createMockPrismaService();
    jwtService = { sign: jest.fn().mockReturnValue('jwt-token') };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: prisma },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  describe('login', () => {
    const loginDto = { email: 'test@test.com', password: 'password123' };

    it('debe retornar un access_token con credenciales válidas', async () => {
      const hashed = await bcrypt.hash('password123', 10);
      prisma.usuario.findUnique.mockResolvedValue({
        id: 1,
        email: 'test@test.com',
        contrasena: hashed,
      });

      const result = await service.login(loginDto);

      expect(result).toEqual({ access_token: 'jwt-token' });
      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: 1,
        email: 'test@test.com',
      });
    });

    it('debe lanzar UnauthorizedException si el usuario no existe', async () => {
      prisma.usuario.findUnique.mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('debe lanzar UnauthorizedException si la contraseña es incorrecta', async () => {
      const hashed = await bcrypt.hash('otra-password', 10);
      prisma.usuario.findUnique.mockResolvedValue({
        id: 1,
        email: 'test@test.com',
        contrasena: hashed,
      });

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('getProfile', () => {
    it('debe retornar el perfil del usuario', async () => {
      const user = {
        id: 1,
        nombre: 'Test',
        celular: '123',
        email: 'test@test.com',
        sucursal_id: 1,
        created_at: new Date(),
      };
      prisma.usuario.findUnique.mockResolvedValue(user);

      const result = await service.getProfile(1);

      expect(result).toEqual(user);
      expect(prisma.usuario.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        select: {
          id: true,
          nombre: true,
          celular: true,
          email: true,
          sucursal_id: true,
          created_at: true,
        },
      });
    });
  });
});
