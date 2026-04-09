import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateSucursalDto } from './create-sucursal.dto';

export class UpdateSucursalDto extends PartialType(
  OmitType(CreateSucursalDto, ['estudio_id'] as const),
) {}
