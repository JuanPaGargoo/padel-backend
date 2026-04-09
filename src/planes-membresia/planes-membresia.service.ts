import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePlanMembresiaDto } from './dto/create-plan-membresia.dto';
import { UpdatePlanMembresiaDto } from './dto/update-plan-membresia.dto';

@Injectable()
export class PlanesMembresiaService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreatePlanMembresiaDto) {
    return this.prisma.planMembresia.create({ data: dto });
  }

  findAll() {
    return this.prisma.planMembresia.findMany();
  }

  async findOne(id: number) {
    const plan = await this.prisma.planMembresia.findUnique({ where: { id } });
    if (!plan) throw new NotFoundException('Plan de membresía no encontrado');
    return plan;
  }

  async update(id: number, dto: UpdatePlanMembresiaDto) {
    await this.findOne(id);
    return this.prisma.planMembresia.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.planMembresia.delete({ where: { id } });
  }
}
