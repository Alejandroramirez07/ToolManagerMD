import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../enums/roles.enum';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true; // No @Roles() decorator, access granted
    }

    // A simplified mock of the user object attached by an AuthGuard
    // In a real application, this user object would be provided by a JWT/Auth strategy.
    const { user } = context.switchToHttp().getRequest();

    // The user's role must be one of the required roles
    // Example User Object: { id: 1, email: 'user@test.com', role: Role.Professor }
    return requiredRoles.some((role) => user.role === role);
  }
}