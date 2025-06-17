import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsPositive, IsString, IsUUID } from 'class-validator';

export class CreateStallDto {
  @IsNumber()
  @Type(() => Number)
  number: number;

  @Type(() => Number)
  @IsNumber()
  @IsPositive({ message: 'El area no puede ser negativa' })
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
