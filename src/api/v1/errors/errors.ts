import { HTTP_STATUS } from "../../../constants/httpConstants";

/**
 * Base error class for application errors.
 * Extends the built-in Error class to include an error code and status code.
 *
 * This abstract provides:
 * - Consistent error structure for the whole application
 * - HTTP status codes for the proper responses
 * - Error codes for proper error handling
 * - Proper prototype for instance of checks
 */
export class AppError extends Error {
  /**
     * Creates a new AppError instance
     * @param message - The error message.
     * @param code - The error code.
     * @param statusCode - The http response code.
     */
  constructor(
    public message: string,
    public code: string,
    public statusCode: number
  ) {
    super(message);
    this.name = this.constructor.name;
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Represents a repository/data layer error (e.g., Firestore failures).
 */
export class RepositoryError extends AppError {
  constructor(
    message: string,
    code: string,
    statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR
  ) {
    super(message, code, statusCode);
  }
}

/**
 * Represents a domain/service error (validation or business rule violations).
 */
export class ServiceError extends AppError {
  constructor(
    message: string,
    code: string = "SERVICE_ERROR",
    statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR
  ) {
    super(message, code, statusCode);
  }
}

/**
 * Represents an authentication failure (invalid/missing/expired tokens).
 */
export class AuthenticationError extends AppError {
  constructor(
    message: string,
    code: string = "AUTHENTICATION_ERROR",
    statusCode: number = HTTP_STATUS.UNAUTHORIZED
  ) {
    super(message, code, statusCode);
  }
}

/**
 * Represents an authorization failure (insufficient role/claims).
 */
export class AuthorizationError extends AppError {
  constructor(
    message: string,
    code: string = "AUTHORIZATION_ERROR",
    statusCode: number = HTTP_STATUS.FORBIDDEN
  ) {
    super(message, code, statusCode);
  }
}
