import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReservaClaseDto } from './dto/create-reserva-clase.dto';

@Injectable()
export class ReservasClaseService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateReservaClaseDto) {
    const clase = await this.prisma.clase.findUnique({
      where: { id: dto.clase_id },
    });
    if (!clase) throw new NotFoundException('Clase no encontrada');

    if (
      clase.capacidad_actual + dto.cantidad_personas >
      clase.capacidad_maxima
    ) {
      throw new BadRequestException('No hay cupo suficiente en la clase');
    }

    const [reserva] = await this.prisma.$transaction([
      this.prisma.reservaClase.create({
        data: {
          usuario_id: dto.usuario_id,
          clase_id: dto.clase_id,
          cantidad_personas: dto.cantidad_personas,
          status: 'confirmada',
        },
      }),
      this.prisma.clase.update({
        where: { id: dto.clase_id },
        data: { capacidad_actual: { increment: dto.cantidad_personas } },
      }),
    ]);

    return reserva;
  }

  findAll(usuario_id?: number, clase_id?: number) {
    return this.prisma.reservaClase.findMany({
      where: {
        ...(usuario_id && { usuario_id }),
        ...(clase_id && { clase_id }),
      },
      include: { clase: true, usuario: true },
    });
  }

  async cancel(id: number) {
    const reserva = await this.prisma.reservaClase.findUnique({
      where: { id },
    });
    if (!reserva) throw new NotFoundException('Reserva no encontrada');
    if (reserva.status === 'cancelada') {
      throw new BadRequestException('La reserva ya está cancelada');
    }

    const [updated] = await this.prisma.$transaction([
      this.prisma.reservaClase.update({
        where: { id },
        data: { status: 'cancelada' },
      }),
      this.prisma.clase.update({
        where: { id: reserva.clase_id },
        data: { capacidad_actual: { decrement: reserva.cantidad_personas } },
      }),
    ]);

    return updated;
  }
}
