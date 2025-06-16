import { Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNumber, IsUUID } from 'class-validator';
import { PaymentMethod } from '../entities';

export class CreateCertificateDto {
  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  code: number;

  @IsUUID()
  stallId: string;

  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;
}
