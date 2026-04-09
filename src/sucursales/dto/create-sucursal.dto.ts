import { IsString, IsInt } from 'class-validator';

export class CreateSucursalDto {
  @IsInt()
  estudio_id: number;

  @IsString()
  nombre: string;

  @IsString()
  direccion: string;

  @IsString()
  ciudad: string;

  @IsString()
  estado: string;

  @IsString()
  codigo_postal: string;
}
