import { IsString, IsInt, IsBoolean, IsNumber } from 'class-validator';

export class CreatePlanMembresiaDto {
  @IsString()
  nombre: string;

  @IsInt()
  clases_incluidas: number;

  @IsInt()
  torneos_incluidos: number;

  @IsBoolean()
  permite_cancha: boolean;

  @IsNumber()
  precio: number;
}
