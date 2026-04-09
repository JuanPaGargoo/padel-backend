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
import { CanchasService } from './canchas.service';
import { CreateCanchaDto } from './dto/create-cancha.dto';
import { UpdateCanchaDto } from './dto/update-cancha.dto';

@ApiTags('Canchas')
@Controller('canchas')
export class CanchasController {
  constructor(private canchasService: CanchasService) {}

  @Post()
  create(@Body() dto: CreateCanchaDto) {
    return this.canchasService.create(dto);
  }

  @Get()
  @ApiQuery({ name: 'sucursal_id', required: false })
  findAll(@Query('sucursal_id') sucursal_id?: string) {
    return this.canchasService.findAll(sucursal_id ? +sucursal_id : undefined);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCanchaDto) {
    return this.canchasService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.canchasService.remove(id);
  }
}
