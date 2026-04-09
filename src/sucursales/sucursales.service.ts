import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSucursalDto } from './dto/create-sucursal.dto';
import { UpdateSucursalDto } from './dto/update-sucursal.dto';

@Injectable()
export class SucursalesService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateSucursalDto) {
    return this.prisma.sucursal.create({ data: dto });
  }

  findAll(estudio_id?: number) {
    return this.prisma.sucursal.findMany({
      where: estudio_id ? { estudio_id } : undefined,
      include: { estudio: true },
    });
  }

  async findOne(id: number) {
    const sucursal = await this.prisma.sucursal.findUnique({
      where: { id },
      include: { estudio: true },
    });
    if (!sucursal) throw new NotFoundException('Sucursal no encontrada');
    return sucursal;
  }

  async update(id: number, dto: UpdateSucursalDto) {
    await this.findOne(id);
    return this.prisma.sucursal.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.sucursal.delete({ where: { id } });
  }
}
