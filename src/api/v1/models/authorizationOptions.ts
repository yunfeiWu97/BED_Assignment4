/**
 * Authorization options used by the role-based authorization middleware.
 * @param hasRole - Allowed roles for this route
 * @param allowSameUser - Whether a user can access their own resource (matching :id)
 */
export interface AuthorizationOptions {
  hasRole: Array<"admin" | "officer" | "manager" | "user">;
  allowSameUser?: boolean;
}
