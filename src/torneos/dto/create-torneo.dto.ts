import { IsInt, IsString, IsDateString, IsEnum } from 'class-validator';

export class CreateTorneoDto {
  @IsInt()
  sucursal_id: number;

  @IsString()
  nombre: string;

  @IsDateString()
  fecha: string;

  @IsString()
  hora_inicio: string;

  @IsString()
  hora_fin: string;

  @IsEnum(['Varonil', 'Femenil', 'Mixto'])
  categoria: 'Varonil' | 'Femenil' | 'Mixto';

  @IsInt()
  capacidad_maxima: number;
}
