import { Module } from '@nestjs/common';
import { PlanesMembresiaService } from './planes-membresia.service';
import { PlanesMembresiaController } from './planes-membresia.controller';

@Module({
  controllers: [PlanesMembresiaController],
  providers: [PlanesMembresiaService],
})
export class PlanesMembresiaModule {}
