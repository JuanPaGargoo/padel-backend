import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateCanchaDto } from './create-cancha.dto';

export class UpdateCanchaDto extends PartialType(
  OmitType(CreateCanchaDto, ['sucursal_id'] as const),
) {}
