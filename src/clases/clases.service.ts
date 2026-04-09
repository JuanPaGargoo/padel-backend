import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateClaseDto } from './dto/create-clase.dto';
import { UpdateClaseDto } from './dto/update-clase.dto';

@Injectable()
export class ClasesService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateClaseDto) {
    return this.prisma.clase.create({
      data: {
        ...dto,
        fecha: new Date(dto.fecha),
        capacidad_actual: 0,
      },
    });
  }

  findAll(sucursal_id?: number, fecha?: string, tipo?: string) {
    return this.prisma.clase.findMany({
      where: {
        ...(sucursal_id && { sucursal_id }),
        ...(fecha && { fecha: new Date(fecha) }),
        ...(tipo && { tipo: tipo as any }),
      },
      include: { coach: true, cancha: true },
    });
  }

  async findOne(id: number) {
    const clase = await this.prisma.clase.findUnique({
      where: { id },
      include: { coach: true, cancha: true },
    });
    if (!clase) throw new NotFoundException('Clase no encontrada');
    return clase;
  }

  async update(id: number, dto: UpdateClaseDto) {
    await this.findOne(id);
    return this.prisma.clase.update({
      where: { id },
      data: {
        ...dto,
        ...(dto.fecha && { fecha: new Date(dto.fecha) }),
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.clase.delete({ where: { id } });
  }
}
