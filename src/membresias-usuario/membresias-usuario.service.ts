import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMembresiaUsuarioDto } from './dto/create-membresia-usuario.dto';
import { UpdateMembresiaUsuarioDto } from './dto/update-membresia-usuario.dto';

@Injectable()
export class MembresiasUsuarioService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateMembresiaUsuarioDto) {
    const plan = await this.prisma.planMembresia.findUnique({
      where: { id: dto.plan_id },
    });
    if (!plan) throw new NotFoundException('Plan no encontrado');

    return this.prisma.membresiaUsuario.create({
      data: {
        usuario_id: dto.usuario_id,
        plan_id: dto.plan_id,
        fecha_inicio: new Date(dto.fecha_inicio),
        fecha_fin: new Date(dto.fecha_fin),
        status: 'activo',
        clases_restantes: plan.clases_incluidas,
        torneos_restantes: plan.torneos_incluidos,
      },
    });
  }

  findAll(usuario_id?: number, status?: string) {
    return this.prisma.membresiaUsuario.findMany({
      where: {
        ...(usuario_id && { usuario_id }),
        ...(status && { status: status as any }),
      },
      include: { plan: true, usuario: true },
    });
  }

  async findOne(id: number) {
    const membresia = await this.prisma.membresiaUsuario.findUnique({
      where: { id },
      include: { plan: true, usuario: true },
    });
    if (!membresia) throw new NotFoundException('Membresía no encontrada');
    return membresia;
  }

  async update(id: number, dto: UpdateMembresiaUsuarioDto) {
    await this.findOne(id);
    return this.prisma.membresiaUsuario.update({
      where: { id },
      data: {
        ...dto,
        ...(dto.fecha_fin && { fecha_fin: new Date(dto.fecha_fin) }),
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.membresiaUsuario.delete({ where: { id } });
  }
}
