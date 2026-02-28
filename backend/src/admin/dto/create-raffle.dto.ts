import { IsString, IsNotEmpty, IsOptional, IsNumber, IsDateString, IsArray, IsBoolean, Min, Max, ValidateNested, IsUrl, MinLength, MaxLength, Matches } from 'class-validator';
import { Type } from 'class-transformer';

class PackDto {
  @IsString({ message: 'El nombre del paquete debe ser un texto' })
  @IsOptional()
  name?: string;

  @IsNumber({}, { message: 'La cantidad de boletos debe ser un número' })
  @IsOptional()
  @Min(1, { message: 'La cantidad de boletos debe ser al menos 1' })
  tickets?: number;

  @IsNumber({}, { message: 'La cantidad (q) debe ser un número' })
  @IsOptional()
  @Min(1, { message: 'La cantidad (q) debe ser al menos 1' })
  q?: number;

  @IsNumber({}, { message: 'El precio debe ser un número' })
  @IsOptional()
  @Min(0, { message: 'El precio no puede ser negativo' })
  price?: number;
}

export class CreateRaffleDto {
  @IsString({ message: 'El título debe ser un texto' })
  @IsNotEmpty({ message: 'El título es requerido' })
  @MinLength(3, { message: 'El título debe tener al menos 3 caracteres' })
  @MaxLength(200, { message: 'El título no puede tener más de 200 caracteres' })
  title: string;

  @IsString({ message: 'La descripción debe ser un texto' })
  @IsOptional()
  @MaxLength(2000, { message: 'La descripción no puede tener más de 2000 caracteres' })
  description?: string;

  @IsString({ message: 'La descripción de compra debe ser un texto' })
  @IsOptional()
  purchaseDescription?: string;

  @IsString({ message: 'La imagen debe ser un texto (URL o base64)' })
  @IsOptional()
  imageUrl?: string;

  @IsArray({ message: 'La galería debe ser un array' })
  @IsOptional()
  gallery?: string[];

  @IsNumber({}, { message: 'El precio debe ser un número' })
  @Min(0.01, { message: 'El precio debe ser mayor a 0' })
  @Max(1000000, { message: 'El precio no puede ser mayor a 1,000,000' })
  price: number;

  @IsNumber({}, { message: 'El número de boletos debe ser un número' })
  @Min(1, { message: 'Debe haber al menos 1 boleto' })
  @Max(1000000, { message: 'No puede haber más de 1,000,000 de boletos' })
  tickets: number;

  @IsDateString({}, { message: 'La fecha de sorteo debe ser una fecha válida' })
  @IsNotEmpty({ message: 'La fecha de sorteo es requerida' })
  drawDate: string;

  @IsString({ message: 'El estado debe ser un texto' })
  @IsOptional()
  status?: string;

  @IsString({ message: 'El slug debe ser un texto' })
  @IsOptional()
  @Matches(/^[a-z0-9-]+$/, { message: 'El slug solo puede contener letras minúsculas, números y guiones' })
  slug?: string;

  @IsBoolean({ message: 'boletosConOportunidades debe ser verdadero o falso' })
  @IsOptional()
  boletosConOportunidades?: boolean;

  @IsNumber({}, { message: 'numeroOportunidades debe ser un número' })
  @IsOptional()
  @Min(1, { message: 'numeroOportunidades debe ser al menos 1' })
  @Max(100, { message: 'numeroOportunidades no puede ser mayor a 100' })
  numeroOportunidades?: number;

  @IsNumber({}, { message: 'giftTickets debe ser un número' })
  @IsOptional()
  @Min(0, { message: 'giftTickets no puede ser negativo' })
  giftTickets?: number;

  @IsArray({ message: 'packs debe ser un array' })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => PackDto)
  packs?: PackDto[];

  @IsArray({ message: 'bonuses debe ser un array' })
  @IsOptional()
  @IsString({ each: true, message: 'Cada bono debe ser un texto' })
  bonuses?: string[];
}

export class UpdateRaffleDto {
  @IsString({ message: 'El título debe ser un texto' })
  @IsOptional()
  @MinLength(3, { message: 'El título debe tener al menos 3 caracteres' })
  @MaxLength(200, { message: 'El título no puede tener más de 200 caracteres' })
  title?: string;

  @IsString({ message: 'La descripción debe ser un texto' })
  @IsOptional()
  @MaxLength(2000, { message: 'La descripción no puede tener más de 2000 caracteres' })
  description?: string;

  @IsString({ message: 'La descripción de compra debe ser un texto' })
  @IsOptional()
  purchaseDescription?: string;

  @IsString({ message: 'La imagen debe ser un texto (URL o base64)' })
  @IsOptional()
  imageUrl?: string;

  @IsArray({ message: 'La galería debe ser un array' })
  @IsOptional()
  gallery?: string[];

  @IsNumber({}, { message: 'El precio debe ser un número' })
  @IsOptional()
  @Min(0.01, { message: 'El precio debe ser mayor a 0' })
  @Max(1000000, { message: 'El precio no puede ser mayor a 1,000,000' })
  price?: number;

  @IsNumber({}, { message: 'El número de boletos debe ser un número' })
  @IsOptional()
  @Min(1, { message: 'Debe haber al menos 1 boleto' })
  @Max(1000000, { message: 'No puede haber más de 1,000,000 de boletos' })
  tickets?: number;

  @IsDateString({}, { message: 'La fecha de sorteo debe ser una fecha válida' })
  @IsOptional()
  drawDate?: string;

  @IsString({ message: 'El estado debe ser un texto' })
  @IsOptional()
  status?: string;

  @IsString({ message: 'El slug debe ser un texto' })
  @IsOptional()
  @Matches(/^[a-z0-9-]+$/, { message: 'El slug solo puede contener letras minúsculas, números y guiones' })
  slug?: string;

  @IsBoolean({ message: 'boletosConOportunidades debe ser verdadero o falso' })
  @IsOptional()
  boletosConOportunidades?: boolean;

  @IsNumber({}, { message: 'numeroOportunidades debe ser un número' })
  @IsOptional()
  @Min(1, { message: 'numeroOportunidades debe ser al menos 1' })
  @Max(100, { message: 'numeroOportunidades no puede ser mayor a 100' })
  numeroOportunidades?: number;

  @IsNumber({}, { message: 'giftTickets debe ser un número' })
  @IsOptional()
  @Min(0, { message: 'giftTickets no puede ser negativo' })
  giftTickets?: number;

  @IsArray({ message: 'packs debe ser un array' })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => PackDto)
  packs?: PackDto[];

  @IsArray({ message: 'bonuses debe ser un array' })
  @IsOptional()
  @IsString({ each: true, message: 'Cada bono debe ser un texto' })
  bonuses?: string[];
}

