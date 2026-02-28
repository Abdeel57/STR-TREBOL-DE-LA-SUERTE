import { IsEnum, IsNotEmpty } from 'class-validator';
// FIX: Using `import type` for types/namespaces and value import for the enum to fix module resolution.
import { OrderStatus } from '@prisma/client';

export class UpdateOrderStatusDto {
  @IsNotEmpty()
  @IsEnum(OrderStatus, {
    message: `Status must be a valid enum value: ${Object.values(OrderStatus).join(', ')}`,
  })
  status: OrderStatus;
}

