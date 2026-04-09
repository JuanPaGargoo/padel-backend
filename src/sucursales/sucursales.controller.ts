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
import { SucursalesService } from './sucursales.service';
import { CreateSucursalDto } from './dto/create-sucursal.dto';
import { UpdateSucursalDto } from './dto/update-sucursal.dto';

@ApiTags('Sucursales')
@Controller('sucursales')
export class SucursalesController {
  constructor(private sucursalesService: SucursalesService) {}

  @Post()
  create(@Body() dto: CreateSucursalDto) {
    return this.sucursalesService.create(dto);
  }

  @Get()
  @ApiQuery({ name: 'estudio_id', required: false })
  findAll(@Query('estudio_id') estudio_id?: string) {
    return this.sucursalesService.findAll(estudio_id ? +estudio_id : undefined);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.sucursalesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateSucursalDto,
  ) {
    return this.sucursalesService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.sucursalesService.remove(id);
  }
}
