import { Request, Response, NextFunction } from "express";
import { AuthorizationOptions } from "../models/authorizationOptions";
import { MiddlewareFunction } from "../types/express";
import { AuthorizationError } from "../errors/errors";

/**
 * Factory that returns a middleware to enforce role-based access control.
 * Supports:
 * - Role allowlist
 * - Optional same-user access when route has :id
 */
const isAuthorized = (options: AuthorizationOptions): MiddlewareFunction => {
  return (request: Request, response: Response, nextFunction: NextFunction): void => {
    try {
      const userRole: string | undefined = response.locals.role;
      const userIdFromToken: string | undefined = response.locals.uid;
      const resourceIdFromRoute: string | undefined = request.params?.id;

      if (options.allowSameUser && resourceIdFromRoute && userIdFromToken === resourceIdFromRoute) {
        return nextFunction();
      }

      if (!userRole) {
        throw new AuthorizationError("Forbidden: No role found", "ROLE_NOT_FOUND");
      }

      if (options.hasRole.includes(userRole as AuthorizationOptions["hasRole"][number])) {
        return nextFunction();
      }

      throw new AuthorizationError("Forbidden: Insufficient role", "INSUFFICIENT_ROLE");
    } catch (unknownError: unknown) {
      nextFunction(unknownError);
    }
  };
};

export default isAuthorized;
