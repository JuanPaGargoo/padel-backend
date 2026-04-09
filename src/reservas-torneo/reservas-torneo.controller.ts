import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiQuery } from '@nestjs/swagger';
import { ReservasTorneoService } from './reservas-torneo.service';
import { CreateReservaTorneoDto } from './dto/create-reserva-torneo.dto';

@ApiTags('Reservas Torneo')
@Controller('reservas-torneo')
export class ReservasTorneoController {
  constructor(private reservasTorneoService: ReservasTorneoService) {}

  @Post()
  create(@Body() dto: CreateReservaTorneoDto) {
    return this.reservasTorneoService.create(dto);
  }

  @Get()
  @ApiQuery({ name: 'usuario_id', required: false })
  @ApiQuery({ name: 'torneo_id', required: false })
  findAll(
    @Query('usuario_id') usuario_id?: string,
    @Query('torneo_id') torneo_id?: string,
  ) {
    return this.reservasTorneoService.findAll(
      usuario_id ? +usuario_id : undefined,
      torneo_id ? +torneo_id : undefined,
    );
  }

  @Patch(':id/cancelar')
  cancel(@Param('id', ParseIntPipe) id: number) {
    return this.reservasTorneoService.cancel(id);
  }
}
