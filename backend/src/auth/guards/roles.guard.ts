import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Obtener los roles requeridos del decorador @Roles()
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Si no hay roles requeridos, permitir acceso (endpoint público o sin restricciones)
    if (!requiredRoles) {
      return true;
    }

    // Obtener el usuario del request (inyectado por JwtAuthGuard)
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Si no hay usuario, denegar acceso
    if (!user) {
      throw new ForbiddenException('Usuario no autenticado');
    }

    // Verificar si el usuario tiene uno de los roles requeridos
    const userRole = user.role || 'ventas'; // Default a 'ventas' si no tiene rol
    
    // superadmin tiene acceso a todo
    if (userRole === 'superadmin') {
      return true;
    }

    // Verificar si el rol del usuario está en los roles requeridos
    if (!requiredRoles.includes(userRole)) {
      throw new ForbiddenException(
        `Acceso denegado. Se requiere uno de los siguientes roles: ${requiredRoles.join(', ')}`
      );
    }

    return true;
  }
}

