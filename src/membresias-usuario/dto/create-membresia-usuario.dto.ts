import { IsInt, IsDateString } from 'class-validator';

export class CreateMembresiaUsuarioDto {
  @IsInt()
  usuario_id: number;

  @IsInt()
  plan_id: number;

  @IsDateString()
  fecha_inicio: string;

  @IsDateString()
  fecha_fin: string;
}
