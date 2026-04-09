import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateClaseDto } from './create-clase.dto';

export class UpdateClaseDto extends PartialType(
  OmitType(CreateClaseDto, ['sucursal_id'] as const),
) {}
