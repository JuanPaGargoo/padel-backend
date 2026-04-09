import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

@Injectable()
export class UsuariosService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateUsuarioDto) {
    const exists = await this.prisma.usuario.findUnique({
      where: { email: dto.email },
    });
    if (exists) {
      throw new ConflictException('El email ya está registrado');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    return this.prisma.usuario.create({
      data: {
        nombre: dto.nombre,
        email: dto.email,
        celular: dto.celular,
        contrasena: hashedPassword,
        sucursal_id: dto.sucursal_id,
      },
    });
  }

  findAll(sucursal_id?: number, email?: string) {
    return this.prisma.usuario.findMany({
      where: {
        ...(sucursal_id && { sucursal_id }),
        ...(email && { email }),
      },
    });
  }

  async findOne(id: number) {
    const usuario = await this.prisma.usuario.findUnique({ where: { id } });
    if (!usuario) throw new NotFoundException('Usuario no encontrado');
    return usuario;
  }

  async update(id: number, dto: UpdateUsuarioDto) {
    await this.findOne(id);
    return this.prisma.usuario.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.usuario.delete({ where: { id } });
  }
}
