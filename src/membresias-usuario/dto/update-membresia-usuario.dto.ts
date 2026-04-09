import { IsOptional, IsEnum, IsDateString, IsInt } from 'class-validator';

export class UpdateMembresiaUsuarioDto {
  @IsOptional()
  @IsEnum(['activo', 'inactivo'])
  status?: 'activo' | 'inactivo';

  @IsOptional()
  @IsDateString()
  fecha_fin?: string;

  @IsOptional()
  @IsInt()
  clases_restantes?: number;

  @IsOptional()
  @IsInt()
  torneos_restantes?: number;
}
