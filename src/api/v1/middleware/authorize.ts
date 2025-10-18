import { Request, Response, NextFunction } from "express";
import { AuthorizationOptions, Role } from "../models/authorizationOptions";
import { AuthorizationError } from "../errors/errors";

/**
 * Role-based authorization middleware.
 *
 * Behavior:
 * - If `allowSameUser` is true and `:id` equals `response.locals.uid`, the request is allowed.
 * - If `hasRole` is omitted or empty, any authenticated user is allowed.
 * - Otherwise, the current user's role must be included in `hasRole`.
 *
 * @param authorizationOptions - Allowed roles and whether to allow the same user to access their own resource.
 * @returns Express middleware function.
 */
const authorize = (authorizationOptions: AuthorizationOptions) => {
  return (request: Request, response: Response, nextFunction: NextFunction): void => {
    try {
      const currentUserRole: Role | undefined = response.locals.role;
      const currentUserId: string | undefined = response.locals.uid;
      const { id: resourceOwnerId } = request.params;

      // 1) Same-user access
      if (
        authorizationOptions.allowSameUser &&
        resourceOwnerId &&
        currentUserId &&
        resourceOwnerId === currentUserId
      ) {
        return nextFunction();
      }

      // 2) Missing role → forbidden
      if (!currentUserRole) {
        throw new AuthorizationError("Forbidden: No role found", "ROLE_NOT_FOUND");
      }

      // 3) No hasRole provided → any authenticated user
      const allowedRoles: Role[] | undefined = authorizationOptions.hasRole;
      if (!allowedRoles || allowedRoles.length === 0 || allowedRoles.includes(currentUserRole)) {
        return nextFunction();
      }

      // 4) Insufficient role
      throw new AuthorizationError("Forbidden: Insufficient role", "INSUFFICIENT_ROLE");
    } catch (unknownError: unknown) {
      nextFunction(unknownError);
    }
  };
};

export default authorize;
