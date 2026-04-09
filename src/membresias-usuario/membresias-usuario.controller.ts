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
import { MembresiasUsuarioService } from './membresias-usuario.service';
import { CreateMembresiaUsuarioDto } from './dto/create-membresia-usuario.dto';
import { UpdateMembresiaUsuarioDto } from './dto/update-membresia-usuario.dto';

@ApiTags('Membresías Usuario')
@Controller('membresias-usuario')
export class MembresiasUsuarioController {
  constructor(private membresiasUsuarioService: MembresiasUsuarioService) {}

  @Post()
  create(@Body() dto: CreateMembresiaUsuarioDto) {
    return this.membresiasUsuarioService.create(dto);
  }

  @Get()
  @ApiQuery({ name: 'usuario_id', required: false })
  @ApiQuery({ name: 'status', required: false })
  findAll(
    @Query('usuario_id') usuario_id?: string,
    @Query('status') status?: string,
  ) {
    return this.membresiasUsuarioService.findAll(
      usuario_id ? +usuario_id : undefined,
      status,
    );
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateMembresiaUsuarioDto,
  ) {
    return this.membresiasUsuarioService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.membresiasUsuarioService.remove(id);
  }
}
