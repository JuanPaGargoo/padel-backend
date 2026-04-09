import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiQuery } from '@nestjs/swagger';
import { TorneosService } from './torneos.service';
import { CreateTorneoDto } from './dto/create-torneo.dto';
import { UpdateTorneoDto } from './dto/update-torneo.dto';

@ApiTags('Torneos')
@Controller('torneos')
export class TorneosController {
  constructor(private torneosService: TorneosService) {}

  @Post()
  create(@Body() dto: CreateTorneoDto) {
    return this.torneosService.create(dto);
  }

  @Get()
  @ApiQuery({ name: 'sucursal_id', required: false })
  @ApiQuery({ name: 'fecha', required: false })
  findAll(
    @Query('sucursal_id') sucursal_id?: string,
    @Query('fecha') fecha?: string,
  ) {
    return this.torneosService.findAll(
      sucursal_id ? +sucursal_id : undefined,
      fecha,
    );
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.torneosService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateTorneoDto) {
    return this.torneosService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.torneosService.remove(id);
  }
}
