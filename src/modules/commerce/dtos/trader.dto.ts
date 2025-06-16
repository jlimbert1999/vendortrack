import { IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';

export class CreateTraderDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastNamePaternal: string;

  @IsString()
  @IsNotEmpty()
  lastNameMaternal: string;

  @IsString()
  @IsNotEmpty()
  dni: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  photo?: string;

  @IsDate()
  @Type(() => Date)
  grantDate: Date;
}

export class UpdateTraderDto extends PartialType(CreateTraderDto) {}
