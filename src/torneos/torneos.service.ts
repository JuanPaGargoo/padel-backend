import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTorneoDto } from './dto/create-torneo.dto';
import { UpdateTorneoDto } from './dto/update-torneo.dto';

@Injectable()
export class TorneosService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateTorneoDto) {
    return this.prisma.torneo.create({
      data: {
        ...dto,
        fecha: new Date(dto.fecha),
        lugares_disponibles: dto.capacidad_maxima,
      },
    });
  }

  findAll(sucursal_id?: number, fecha?: string) {
    return this.prisma.torneo.findMany({
      where: {
        ...(sucursal_id && { sucursal_id }),
        ...(fecha && { fecha: new Date(fecha) }),
      },
    });
  }

  async findOne(id: number) {
    const torneo = await this.prisma.torneo.findUnique({ where: { id } });
    if (!torneo) throw new NotFoundException('Torneo no encontrado');
    return torneo;
  }

  async update(id: number, dto: UpdateTorneoDto) {
    await this.findOne(id);
    return this.prisma.torneo.update({
      where: { id },
      data: {
        ...dto,
        ...(dto.fecha && { fecha: new Date(dto.fecha) }),
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.torneo.delete({ where: { id } });
  }
}
