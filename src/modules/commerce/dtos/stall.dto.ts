import { OmitType, PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { IsInt, IsNumber, IsOptional, IsPositive, IsString, IsUUID, Min } from 'class-validator';

export class CreateStallDto {
  @IsNumber()
  @Type(() => Number)
  number: number;

  @Type(() => Number)
  @IsNumber()
  @IsPositive({ message: 'El area no puede ser negativa' })
  area: number;

  @IsString()
  @IsOptional()
  location?: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  floor: number;

  @IsUUID()
  traderId: string;

  @IsNumber()
  marketId: number;

  @IsNumber()
  categoryId: number;

  @IsNumber()
  taxZoneId: number;
}

export class UpdateStallDto extends PartialType(
  OmitType(CreateStallDto, ['number', 'marketId', 'categoryId', 'taxZoneId'] as const),
) {}
