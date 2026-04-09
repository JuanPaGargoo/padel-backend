import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReservaTorneoDto } from './dto/create-reserva-torneo.dto';

@Injectable()
export class ReservasTorneoService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateReservaTorneoDto) {
    const torneo = await this.prisma.torneo.findUnique({
      where: { id: dto.torneo_id },
    });
    if (!torneo) throw new NotFoundException('Torneo no encontrado');

    if (torneo.lugares_disponibles <= 0) {
      throw new BadRequestException('No hay lugares disponibles en el torneo');
    }

    const [reserva] = await this.prisma.$transaction([
      this.prisma.reservaTorneo.create({
        data: {
          usuario_id: dto.usuario_id,
          torneo_id: dto.torneo_id,
          status: 'confirmada',
        },
      }),
      this.prisma.torneo.update({
        where: { id: dto.torneo_id },
        data: { lugares_disponibles: { decrement: 1 } },
      }),
    ]);

    return reserva;
  }

  findAll(usuario_id?: number, torneo_id?: number) {
    return this.prisma.reservaTorneo.findMany({
      where: {
        ...(usuario_id && { usuario_id }),
        ...(torneo_id && { torneo_id }),
      },
      include: { torneo: true, usuario: true },
    });
  }

  async cancel(id: number) {
    const reserva = await this.prisma.reservaTorneo.findUnique({
      where: { id },
    });
    if (!reserva) throw new NotFoundException('Reserva no encontrada');
    if (reserva.status === 'cancelada') {
      throw new BadRequestException('La reserva ya está cancelada');
    }

    const [updated] = await this.prisma.$transaction([
      this.prisma.reservaTorneo.update({
        where: { id },
        data: { status: 'cancelada' },
      }),
      this.prisma.torneo.update({
        where: { id: reserva.torneo_id },
        data: { lugares_disponibles: { increment: 1 } },
      }),
    ]);

    return updated;
  }
}
