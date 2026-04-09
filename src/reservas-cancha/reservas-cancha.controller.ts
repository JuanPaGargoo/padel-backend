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
import { ReservasCanchaService } from './reservas-cancha.service';
import { CreateReservaCanchaDto } from './dto/create-reserva-cancha.dto';

@ApiTags('Reservas Cancha')
@Controller('reservas-cancha')
export class ReservasCanchaController {
  constructor(private reservasCanchaService: ReservasCanchaService) {}

  @Post()
  create(@Body() dto: CreateReservaCanchaDto) {
    return this.reservasCanchaService.create(dto);
  }

  @Get()
  @ApiQuery({ name: 'usuario_id', required: false })
  @ApiQuery({ name: 'cancha_id', required: false })
  @ApiQuery({ name: 'fecha', required: false })
  findAll(
    @Query('usuario_id') usuario_id?: string,
    @Query('cancha_id') cancha_id?: string,
    @Query('fecha') fecha?: string,
  ) {
    return this.reservasCanchaService.findAll(
      usuario_id ? +usuario_id : undefined,
      cancha_id ? +cancha_id : undefined,
      fecha,
    );
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.reservasCanchaService.findOne(id);
  }

  @Patch(':id/cancelar')
  cancel(@Param('id', ParseIntPipe) id: number) {
    return this.reservasCanchaService.cancel(id);
  }
}
