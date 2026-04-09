import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateTorneoDto } from './create-torneo.dto';

export class UpdateTorneoDto extends PartialType(
  OmitType(CreateTorneoDto, ['sucursal_id'] as const),
) {}
