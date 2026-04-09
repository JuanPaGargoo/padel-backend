import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { EstudiosService } from './estudios.service';
import { CreateEstudioDto } from './dto/create-estudio.dto';
import { UpdateEstudioDto } from './dto/update-estudio.dto';

@ApiTags('Estudios')
@Controller('estudios')
export class EstudiosController {
  constructor(private estudiosService: EstudiosService) {}

  @Post()
  create(@Body() dto: CreateEstudioDto) {
    return this.estudiosService.create(dto);
  }

  @Get()
  findAll() {
    return this.estudiosService.findAll();
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateEstudioDto) {
    return this.estudiosService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.estudiosService.remove(id);
  }
}
