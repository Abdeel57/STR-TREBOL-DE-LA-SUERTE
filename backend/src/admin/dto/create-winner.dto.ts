import { IsString, IsNotEmpty, IsOptional, IsNumber, IsDateString, IsUrl, MinLength, MaxLength, Min } from 'class-validator';

export class CreateWinnerDto {
  @IsString({ message: 'El nombre debe ser un texto' })
  @IsNotEmpty({ message: 'El nombre es requerido' })
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres' })
  @MaxLength(200, { message: 'El nombre no puede tener más de 200 caracteres' })
  name: string;

  @IsString({ message: 'El premio debe ser un texto' })
  @IsNotEmpty({ message: 'El premio es requerido' })
  @MinLength(3, { message: 'El premio debe tener al menos 3 caracteres' })
  @MaxLength(500, { message: 'El premio no puede tener más de 500 caracteres' })
  prize: string;

  @IsUrl({}, { message: 'La URL de la imagen debe ser válida' })
  @IsNotEmpty({ message: 'La URL de la imagen es requerida' })
  imageUrl: string;

  @IsString({ message: 'El título de la rifa debe ser un texto' })
  @IsNotEmpty({ message: 'El título de la rifa es requerido' })
  @MinLength(3, { message: 'El título de la rifa debe tener al menos 3 caracteres' })
  @MaxLength(200, { message: 'El título de la rifa no puede tener más de 200 caracteres' })
  raffleTitle: string;

  @IsDateString({}, { message: 'La fecha de sorteo debe ser una fecha válida' })
  @IsNotEmpty({ message: 'La fecha de sorteo es requerida' })
  drawDate: string;

  @IsNumber({}, { message: 'El número de boleto debe ser un número' })
  @IsOptional()
  @Min(1, { message: 'El número de boleto debe ser al menos 1' })
  ticketNumber?: number;

  @IsString({ message: 'El testimonio debe ser un texto' })
  @IsOptional()
  @MaxLength(2000, { message: 'El testimonio no puede tener más de 2000 caracteres' })
  testimonial?: string;

  @IsString({ message: 'El teléfono debe ser un texto' })
  @IsOptional()
  @MaxLength(20, { message: 'El teléfono no puede tener más de 20 caracteres' })
  phone?: string;

  @IsString({ message: 'La ciudad debe ser un texto' })
  @IsOptional()
  @MaxLength(100, { message: 'La ciudad no puede tener más de 100 caracteres' })
  city?: string;
}

