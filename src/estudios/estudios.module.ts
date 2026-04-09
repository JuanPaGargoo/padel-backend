import { Module } from '@nestjs/common';
import { EstudiosService } from './estudios.service';
import { EstudiosController } from './estudios.controller';

@Module({
  controllers: [EstudiosController],
  providers: [EstudiosService],
})
export class EstudiosModule {}
