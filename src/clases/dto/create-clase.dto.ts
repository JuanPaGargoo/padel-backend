import { IsInt, IsString, IsEnum, IsDateString } from 'class-validator';

export class CreateClaseDto {
  @IsInt()
  sucursal_id: number;

  @IsInt()
  coach_id: number;

  @IsInt()
  cancha_id: number;

  @IsEnum(['Principiante', 'Intermedio', 'Avanzado', 'Clinica'])
  tipo: 'Principiante' | 'Intermedio' | 'Avanzado' | 'Clinica';

  @IsDateString()
  fecha: string;

  @IsString()
  hora_inicio: string;

  @IsString()
  hora_fin: string;

  @IsInt()
  capacidad_maxima: number;
}
