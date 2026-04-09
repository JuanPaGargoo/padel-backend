import { IsInt } from 'class-validator';

export class CreateReservaTorneoDto {
  @IsInt()
  usuario_id: number;

  @IsInt()
  torneo_id: number;
}
