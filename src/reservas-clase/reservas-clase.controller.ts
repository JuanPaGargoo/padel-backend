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
import { ReservasClaseService } from './reservas-clase.service';
import { CreateReservaClaseDto } from './dto/create-reserva-clase.dto';

@ApiTags('Reservas Clase')
@Controller('reservas-clase')
export class ReservasClaseController {
  constructor(private reservasClaseService: ReservasClaseService) {}

  @Post()
  create(@Body() dto: CreateReservaClaseDto) {
    return this.reservasClaseService.create(dto);
  }

  @Get()
  @ApiQuery({ name: 'usuario_id', required: false })
  @ApiQuery({ name: 'clase_id', required: false })
  findAll(
    @Query('usuario_id') usuario_id?: string,
    @Query('clase_id') clase_id?: string,
  ) {
    return this.reservasClaseService.findAll(
      usuario_id ? +usuario_id : undefined,
      clase_id ? +clase_id : undefined,
    );
  }

  @Patch(':id/cancelar')
  cancel(@Param('id', ParseIntPipe) id: number) {
    return this.reservasClaseService.cancel(id);
  }
}
