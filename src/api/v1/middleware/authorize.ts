import { Request, Response, NextFunction } from "express";
import { AuthorizationOptions, Role } from "../models/authorizationOptions";
import { AuthorizationError } from "../errors/errors";

/**
 * Role-based authorization middleware.
 * Usage: authorize({ hasRole: ["manager"], allowSameUser: true })
 */
const authorize = (authOptions: AuthorizationOptions) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const role: Role | undefined = res.locals.role;
      const uid: string | undefined = res.locals.uid;
      const { id } = req.params;

      // 1) allowSameUser: if true and :id 
      if (authOptions.allowSameUser && id && uid && id === uid) {
        return next();
      }
      
      // 2) no role => forbidden
      if (!role) {
        throw new AuthorizationError("Forbidden: No role found", "ROLE_NOT_FOUND");
      }
      
      // 3) if hasRole is not provided, any authenticated user is considered
      const allowed = authOptions.hasRole;
      if (!allowed || allowed.length === 0 || allowed.includes(role)) {
        return next();
      }
      
      // 4) insufficient role
      throw new AuthorizationError("Forbidden: Insufficient role", "INSUFFICIENT_ROLE");
    } catch (error) {
      next(error); 
    }
  };
};

export default authorize;
