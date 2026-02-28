import { IsString, IsOptional, IsArray, IsNumber, Min, Max, IsObject, ValidateNested, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';

class CustomerDto {
  @IsString({ message: 'El nombre del cliente debe ser un texto' })
  @IsOptional()
  name?: string;

  @IsString({ message: 'El teléfono del cliente debe ser un texto' })
  @IsOptional()
  phone?: string;

  @IsString({ message: 'El email del cliente debe ser un texto' })
  @IsOptional()
  email?: string;

  @IsString({ message: 'El distrito del cliente debe ser un texto' })
  @IsOptional()
  district?: string;
}

export class EditOrderDto {
  @IsObject({ message: 'El cliente debe ser un objeto' })
  @IsOptional()
  @ValidateNested()
  @Type(() => CustomerDto)
  customer?: CustomerDto;

  @IsArray({ message: 'Los boletos deben ser un array' })
  @IsOptional()
  @IsNumber({}, { each: true, message: 'Cada boleto debe ser un número' })
  @Min(1, { each: true, message: 'Cada boleto debe ser al menos 1' })
  tickets?: number[];

  @IsString({ message: 'Las notas deben ser un texto' })
  @IsOptional()
  @MaxLength(1000, { message: 'Las notas no pueden tener más de 1000 caracteres' })
  notes?: string;
}

export class MarkOrderPaidDto {
  @IsString({ message: 'El método de pago debe ser un texto' })
  @IsOptional()
  @MaxLength(100, { message: 'El método de pago no puede tener más de 100 caracteres' })
  paymentMethod?: string;

  @IsString({ message: 'Las notas deben ser un texto' })
  @IsOptional()
  @MaxLength(1000, { message: 'Las notas no pueden tener más de 1000 caracteres' })
  notes?: string;
}

