import { IsInt, IsString, IsDateString, IsEnum } from 'class-validator';

export class CreateReservaCanchaDto {
  @IsInt()
  usuario_id: number;

  @IsInt()
  cancha_id: number;

  @IsDateString()
  fecha: string;

  @IsString()
  hora_inicio: string;

  @IsString()
  hora_fin: string;

  @IsEnum(['60', '90', '120'])
  duracion_min: '60' | '90' | '120';
}
