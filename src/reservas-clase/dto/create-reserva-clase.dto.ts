import { IsInt, Min, Max } from 'class-validator';

export class CreateReservaClaseDto {
  @IsInt()
  usuario_id: number;

  @IsInt()
  clase_id: number;

  @IsInt()
  @Min(1)
  @Max(4)
  cantidad_personas: number;
}
