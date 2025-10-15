import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/errors";
import { HTTP_STATUS } from "../../../constants/httpConstants";
import { errorResponse } from "../models/responseModel";

/**
 * Global error handling Express middleware.
 * Catches all errors passed to next() and formats them into a consistent response.
 *
 * This middleware:
 * - Handles all AppError subclasses (AuthenticationError, AuthorizationError, etc.)
 * - Uses a consistent error response format via errorResponse()
 * - Logs errors for debugging and monitoring
 * - Hides stack traces in production to prevent sensitive information leakage
 *
 * @param err - The error object passed down the middleware chain.
 * @param _req - Express request object (unused but required by the middleware signature).
 * @param res - Express response object used to send the formatted error.
 * @param _next - Express next function (unused but required by the middleware signature).
 * @returns void
 */
const errorHandler = (
    err: Error | null,
    _req: Request,
    res: Response,
    _next: NextFunction
): void => {
    if (!err) {
        // Defensive: should not happen, but keep behavior predictable
        if (process.env.NODE_ENV !== "production") {
            console.error("Error: null or undefined error received");
        }
        res
            .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
            .json(errorResponse("An unexpected error occurred", "UNKNOWN_ERROR"));
        return;
    }

    // Always log the error message; only log stack when not production
    console.error(`Error: ${err.message}`);
    if (process.env.NODE_ENV !== "production" && err.stack) {
        console.error(`Stack: ${err.stack}`);
    }

    if (err instanceof AppError) {
        // Our controlled application errors
        res.status(err.statusCode).json(errorResponse(err.message, err.code));
        return;
    }

    // Fallback: unexpected/third-party/library errors
    res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .json(errorResponse("An unexpected error occurred", "UNKNOWN_ERROR"));
};

export default errorHandler;
