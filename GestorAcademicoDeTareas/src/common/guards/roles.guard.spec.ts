import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolesGuard } from './roles.guard';
import { Role } from '../enums/roles.enum';
import { ROLES_KEY } from '../decorators/roles.decorator';

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: Reflector;

  beforeEach(() => {
    reflector = new Reflector();
    guard = new RolesGuard(reflector);
  });

  const createMockExecutionContext = (user: any, roles?: Role[]) => {
    const mockHandler = jest.fn();
    const mockClass = jest.fn();

    // Mock getMetadata for roles decorator
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(roles);

    return {
      switchToHttp: () => ({
        getRequest: () => ({
          user,
        }),
      }),
      getHandler: jest.fn().mockReturnValue(mockHandler),
      getClass: jest.fn().mockReturnValue(mockClass),
    } as unknown as ExecutionContext;
  };

  describe('canActivate', () => {
    it('should return true when no roles are required', () => {
      const context = createMockExecutionContext(
        { role: Role.Student },
        undefined,
      );

      const result = guard.canActivate(context);
      expect(result).toBe(true);
    });

    it('should return true when user has required role (Professor)', () => {
      const user = { role: Role.Professor };
      const context = createMockExecutionContext(user, [Role.Professor]);

      const result = guard.canActivate(context);
      expect(result).toBe(true);
    });

    it('should return true when user has required role (Student)', () => {
      const user = { role: Role.Student };
      const context = createMockExecutionContext(user, [Role.Student]);

      const result = guard.canActivate(context);
      expect(result).toBe(true);
    });

    it('should return true when user has one of the required roles', () => {
      const user = { role: Role.Professor };
      const context = createMockExecutionContext(user, [Role.Professor, Role.Student]);

      const result = guard.canActivate(context);
      expect(result).toBe(true);
    });

    it('should return false when user does not have required role', () => {
      const user = { role: Role.Student };
      const context = createMockExecutionContext(user, [Role.Professor]);

      const result = guard.canActivate(context);
      expect(result).toBe(false);
    });

    it('should return false when user role is not in multiple required roles', () => {
      const user = { role: Role.Student };
      const context = createMockExecutionContext(user, [Role.Professor]);

      const result = guard.canActivate(context);
      expect(result).toBe(false);
    });
  });

  describe('Reflector integration', () => {
    it('should call getAllAndOverride with correct parameters', () => {
      const user = { role: Role.Professor };
      const context = createMockExecutionContext(user, [Role.Professor]);

      guard.canActivate(context);

      expect(reflector.getAllAndOverride).toHaveBeenCalledWith(ROLES_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);
    });
  });
});

