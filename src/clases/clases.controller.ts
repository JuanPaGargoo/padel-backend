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
import { ClasesService } from './clases.service';
import { CreateClaseDto } from './dto/create-clase.dto';
import { UpdateClaseDto } from './dto/update-clase.dto';

@ApiTags('Clases')
@Controller('clases')
export class ClasesController {
  constructor(private clasesService: ClasesService) {}

  @Post()
  create(@Body() dto: CreateClaseDto) {
    return this.clasesService.create(dto);
  }

  @Get()
  @ApiQuery({ name: 'sucursal_id', required: false })
  @ApiQuery({ name: 'fecha', required: false })
  @ApiQuery({ name: 'tipo', required: false })
  findAll(
    @Query('sucursal_id') sucursal_id?: string,
    @Query('fecha') fecha?: string,
    @Query('tipo') tipo?: string,
  ) {
    return this.clasesService.findAll(
      sucursal_id ? +sucursal_id : undefined,
      fecha,
      tipo,
    );
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.clasesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateClaseDto) {
    return this.clasesService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.clasesService.remove(id);
  }
}
