import { Module } from '@nestjs/common';
import { ReservasClaseService } from './reservas-clase.service';
import { ReservasClaseController } from './reservas-clase.controller';

@Module({
  controllers: [ReservasClaseController],
  providers: [ReservasClaseService],
})
export class ReservasClaseModule {}
