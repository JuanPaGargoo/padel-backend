import { IsString, IsInt } from 'class-validator';

export class CreateCanchaDto {
  @IsInt()
  sucursal_id: number;

  @IsString()
  nombre: string;

  @IsString()
  descripcion: string;

  @IsString()
  hora_apertura: string;

  @IsString()
  hora_cierre: string;

  @IsInt()
  total_slots: number;
}
