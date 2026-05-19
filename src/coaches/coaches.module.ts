import { Module } from '@nestjs/common';
import { CoachesService } from './coaches.service';
import { CoachesController } from './coaches.controller';
import { CoachController } from './coach.controller';

@Module({
  controllers: [CoachesController, CoachController],
  providers: [CoachesService],
})
export class CoachesModule {}
