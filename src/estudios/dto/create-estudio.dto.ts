import { IsString } from 'class-validator';

export class CreateEstudioDto {
  @IsString()
  nombre: string;

  @IsString()
  logo_url: string;
}
