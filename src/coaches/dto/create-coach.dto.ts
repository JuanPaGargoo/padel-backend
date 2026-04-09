import { IsString, IsInt, IsEmail } from 'class-validator';

export class CreateCoachDto {
  @IsInt()
  sucursal_id: number;

  @IsString()
  nombre: string;

  @IsEmail()
  email: string;
}
