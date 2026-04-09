import { Module } from '@nestjs/common';
import { ReservasTorneoService } from './reservas-torneo.service';
import { ReservasTorneoController } from './reservas-torneo.controller';

@Module({
  controllers: [ReservasTorneoController],
  providers: [ReservasTorneoService],
})
export class ReservasTorneoModule {}
