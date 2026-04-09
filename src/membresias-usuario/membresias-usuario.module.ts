import { Module } from '@nestjs/common';
import { MembresiasUsuarioService } from './membresias-usuario.service';
import { MembresiasUsuarioController } from './membresias-usuario.controller';

@Module({
  controllers: [MembresiasUsuarioController],
  providers: [MembresiasUsuarioService],
})
export class MembresiasUsuarioModule {}
