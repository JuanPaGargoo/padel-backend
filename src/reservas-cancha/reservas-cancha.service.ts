import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReservaCanchaDto } from './dto/create-reserva-cancha.dto';
import { DuracionMin } from '@prisma/client';

const DURACION_MAP: Record<string, DuracionMin> = {
  '60': 'SIXTY' as DuracionMin,
  '90': 'NINETY' as DuracionMin,
  '120': 'ONE_TWENTY' as DuracionMin,
};

@Injectable()
export class ReservasCanchaService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateReservaCanchaDto) {
    const cancha = await this.prisma.cancha.findUnique({
      where: { id: dto.cancha_id },
    });
    if (!cancha) throw new NotFoundException('Cancha no encontrada');

    const conflict = await this.prisma.reservaCancha.findFirst({
      where: {
        cancha_id: dto.cancha_id,
        fecha: new Date(dto.fecha),
        status: 'confirmada',
        hora_inicio: { lt: dto.hora_fin },
        hora_fin: { gt: dto.hora_inicio },
      },
    });
    if (conflict) {
      throw new BadRequestException(
        'La cancha ya está reservada en ese horario',
      );
    }

    return this.prisma.reservaCancha.create({
      data: {
        usuario_id: dto.usuario_id,
        cancha_id: dto.cancha_id,
        fecha: new Date(dto.fecha),
        hora_inicio: dto.hora_inicio,
        hora_fin: dto.hora_fin,
        duracion_min: DURACION_MAP[dto.duracion_min],
        status: 'confirmada',
      },
    });
  }

  findAll(usuario_id?: number, cancha_id?: number, fecha?: string) {
    return this.prisma.reservaCancha.findMany({
      where: {
        ...(usuario_id && { usuario_id }),
        ...(cancha_id && { cancha_id }),
        ...(fecha && { fecha: new Date(fecha) }),
      },
      include: { cancha: true, usuario: true },
    });
  }

  async findOne(id: number) {
    const reserva = await this.prisma.reservaCancha.findUnique({
      where: { id },
      include: { cancha: true, usuario: true },
    });
    if (!reserva) throw new NotFoundException('Reserva no encontrada');
    return reserva;
  }

  async cancel(id: number) {
    const reserva = await this.prisma.reservaCancha.findUnique({
      where: { id },
    });
    if (!reserva) throw new NotFoundException('Reserva no encontrada');
    if (reserva.status === 'cancelada') {
      throw new BadRequestException('La reserva ya está cancelada');
    }

    return this.prisma.reservaCancha.update({
      where: { id },
      data: { status: 'cancelada' },
    });
  }
}
