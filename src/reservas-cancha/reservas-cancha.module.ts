import { Module } from '@nestjs/common';
import { ReservasCanchaService } from './reservas-cancha.service';
import { ReservasCanchaController } from './reservas-cancha.controller';

@Module({
  controllers: [ReservasCanchaController],
  providers: [ReservasCanchaService],
})
export class ReservasCanchaModule {}
