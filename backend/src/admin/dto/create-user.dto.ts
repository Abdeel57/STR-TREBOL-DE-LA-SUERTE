import { IsString, IsNotEmpty, IsOptional, IsEmail, MinLength, MaxLength, Matches, IsEnum } from 'class-validator';

export class CreateUserDto {
  @IsString({ message: 'El nombre debe ser un texto' })
  @IsNotEmpty({ message: 'El nombre es requerido' })
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres' })
  @MaxLength(100, { message: 'El nombre no puede tener más de 100 caracteres' })
  name: string;

  @IsString({ message: 'El username debe ser un texto' })
  @IsNotEmpty({ message: 'El username es requerido' })
  @MinLength(3, { message: 'El username debe tener al menos 3 caracteres' })
  @MaxLength(50, { message: 'El username no puede tener más de 50 caracteres' })
  @Matches(/^[a-zA-Z0-9_]+$/, { message: 'El username solo puede contener letras, números y guiones bajos' })
  username: string;

  @IsEmail({}, { message: 'El email debe ser válido' })
  @IsOptional()
  @MaxLength(255, { message: 'El email no puede tener más de 255 caracteres' })
  email?: string;

  @IsString({ message: 'La contraseña debe ser un texto' })
  @IsNotEmpty({ message: 'La contraseña es requerida' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  @MaxLength(100, { message: 'La contraseña no puede tener más de 100 caracteres' })
  password: string;

  @IsString({ message: 'El rol debe ser un texto' })
  @IsOptional()
  @IsEnum(['superadmin', 'admin', 'ventas'], { message: 'El rol debe ser uno de: superadmin, admin, ventas' })
  role?: string;
}

export class UpdateUserDto {
  @IsString({ message: 'El nombre debe ser un texto' })
  @IsOptional()
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres' })
  @MaxLength(100, { message: 'El nombre no puede tener más de 100 caracteres' })
  name?: string;

  @IsString({ message: 'El username debe ser un texto' })
  @IsOptional()
  @MinLength(3, { message: 'El username debe tener al menos 3 caracteres' })
  @MaxLength(50, { message: 'El username no puede tener más de 50 caracteres' })
  @Matches(/^[a-zA-Z0-9_]+$/, { message: 'El username solo puede contener letras, números y guiones bajos' })
  username?: string;

  @IsEmail({}, { message: 'El email debe ser válido' })
  @IsOptional()
  @MaxLength(255, { message: 'El email no puede tener más de 255 caracteres' })
  email?: string;

  @IsString({ message: 'La contraseña debe ser un texto' })
  @IsOptional()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  @MaxLength(100, { message: 'La contraseña no puede tener más de 100 caracteres' })
  password?: string;

  @IsString({ message: 'El rol debe ser un texto' })
  @IsOptional()
  @IsEnum(['superadmin', 'admin', 'ventas'], { message: 'El rol debe ser uno de: superadmin, admin, ventas' })
  role?: string;
}

