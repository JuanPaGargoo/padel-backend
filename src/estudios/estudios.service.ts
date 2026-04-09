import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEstudioDto } from './dto/create-estudio.dto';
import { UpdateEstudioDto } from './dto/update-estudio.dto';

@Injectable()
export class EstudiosService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateEstudioDto) {
    return this.prisma.estudio.create({ data: dto });
  }

  findAll() {
    return this.prisma.estudio.findMany({ include: { sucursales: true } });
  }

  async findOne(id: number) {
    const estudio = await this.prisma.estudio.findUnique({
      where: { id },
      include: { sucursales: true },
    });
    if (!estudio) throw new NotFoundException('Estudio no encontrado');
    return estudio;
  }

  async update(id: number, dto: UpdateEstudioDto) {
    await this.findOne(id);
    return this.prisma.estudio.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.estudio.delete({ where: { id } });
  }
}
