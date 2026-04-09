import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCoachDto } from './dto/create-coach.dto';
import { UpdateCoachDto } from './dto/update-coach.dto';

@Injectable()
export class CoachesService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateCoachDto) {
    return this.prisma.coach.create({ data: dto });
  }

  findAll(sucursal_id?: number) {
    return this.prisma.coach.findMany({
      where: sucursal_id ? { sucursal_id } : undefined,
    });
  }

  async findOne(id: number) {
    const coach = await this.prisma.coach.findUnique({ where: { id } });
    if (!coach) throw new NotFoundException('Coach no encontrado');
    return coach;
  }

  async update(id: number, dto: UpdateCoachDto) {
    await this.findOne(id);
    return this.prisma.coach.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.coach.delete({ where: { id } });
  }
}
