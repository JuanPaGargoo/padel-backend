import { IsString, IsEmail, IsInt, MinLength } from 'class-validator';

export class CreateUsuarioDto {
  @IsString()
  nombre: string;

  @IsEmail()
  email: string;

  @IsString()
  celular: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsInt()
  sucursal_id: number;
}
