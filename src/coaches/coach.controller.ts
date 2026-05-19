import {
  Controller,
  Get,
  UseGuards,
  Req,
  NotFoundException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PrismaService } from '../prisma/prisma.service';

@ApiTags('Coach')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('coach')
export class CoachController {
  constructor(private prisma: PrismaService) {}

  @Get('clases')
  async myClases(@Req() req: any) {
    const email: string = req.user.email;
    const coach = await this.prisma.coach.findFirst({ where: { email } });
    if (!coach) {
      throw new NotFoundException('Coach no encontrado para este usuario');
    }
    return this.prisma.clase.findMany({
      where: { coach_id: coach.id },
      include: { cancha: true, sucursal: true },
      orderBy: [{ fecha: 'asc' }, { hora_inicio: 'asc' }],
    });
  }
}
