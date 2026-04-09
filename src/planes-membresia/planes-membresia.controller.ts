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
import { PlanesMembresiaService } from './planes-membresia.service';
import { CreatePlanMembresiaDto } from './dto/create-plan-membresia.dto';
import { UpdatePlanMembresiaDto } from './dto/update-plan-membresia.dto';

@ApiTags('Planes Membresía')
@Controller('planes-membresia')
export class PlanesMembresiaController {
  constructor(private planesMembresiaService: PlanesMembresiaService) {}

  @Post()
  create(@Body() dto: CreatePlanMembresiaDto) {
    return this.planesMembresiaService.create(dto);
  }

  @Get()
  findAll() {
    return this.planesMembresiaService.findAll();
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePlanMembresiaDto,
  ) {
    return this.planesMembresiaService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.planesMembresiaService.remove(id);
  }
}
