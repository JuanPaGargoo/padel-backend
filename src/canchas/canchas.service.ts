import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCanchaDto } from './dto/create-cancha.dto';
import { UpdateCanchaDto } from './dto/update-cancha.dto';

@Injectable()
export class CanchasService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateCanchaDto) {
    return this.prisma.cancha.create({ data: dto });
  }

  findAll(sucursal_id?: number) {
    return this.prisma.cancha.findMany({
      where: sucursal_id ? { sucursal_id } : undefined,
    });
  }

  async findOne(id: number) {
    const cancha = await this.prisma.cancha.findUnique({ where: { id } });
    if (!cancha) throw new NotFoundException('Cancha no encontrada');
    return cancha;
  }

  async update(id: number, dto: UpdateCanchaDto) {
    await this.findOne(id);
    return this.prisma.cancha.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.cancha.delete({ where: { id } });
  }
}
