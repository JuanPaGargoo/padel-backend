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
import { CoachesService } from './coaches.service';
import { CreateCoachDto } from './dto/create-coach.dto';
import { UpdateCoachDto } from './dto/update-coach.dto';

@ApiTags('Coaches')
@Controller('coaches')
export class CoachesController {
  constructor(private coachesService: CoachesService) {}

  @Post()
  create(@Body() dto: CreateCoachDto) {
    return this.coachesService.create(dto);
  }

  @Get()
  @ApiQuery({ name: 'sucursal_id', required: false })
  findAll(@Query('sucursal_id') sucursal_id?: string) {
    return this.coachesService.findAll(sucursal_id ? +sucursal_id : undefined);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCoachDto) {
    return this.coachesService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.coachesService.remove(id);
  }
}
