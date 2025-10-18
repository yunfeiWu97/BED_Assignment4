/**
 * Supported roles for this assignment.
 */
export type Role = "admin" | "officer" | "manager" | "user";

/**
 * Options for the authorize() middleware.
 * - hasRole: list of allowed roles; if omitted, treat as "any authenticated user"
 * - allowSameUser: when true, user can access their own resource if :id === res.locals.uid
 */
export interface AuthorizationOptions {
  hasRole?: Role[];
  allowSameUser?: boolean;
}
