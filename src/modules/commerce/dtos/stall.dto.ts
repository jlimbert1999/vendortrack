import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsNumber, IsString, IsUUID, Min } from 'class-validator';

export class CreateStallDto {
  @IsNumber()
  @Type(() => Number)
  number: number;

  @Type(() => Number)
  @IsInt({ message: 'El código correlativo debe ser un número entero' })
  @Min(1, { message: 'El número no puede ser cero' })
  area: number;

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsUUID()
  traderId: string;

  @IsNumber()
  marketId: number;

  @IsNumber()
  categoryId: number;

  @IsNumber()
  taxZoneId: number;
}
