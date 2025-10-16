import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/errors";
import { HTTP_STATUS } from "../../../constants/httpConstants";
import { errorResponse } from "../models/responseModel";

/**
 * Global error handler: formats ALL errors as JSON and logs safely.
 * - Always returns application/json
 * - AppError → uses its httpStatus/statusCode and code
 * - Unknown error → 500 / "UNKNOWN_ERROR"
 */
export default function errorHandler(
  errorObject: unknown,
  request: Request,
  response: Response,
  nextFunction: NextFunction
): void {
  const standardError = errorObject as Error;

  // Basic logging: message always, stack only outside production
  console.error(`Error: ${standardError?.message ?? "Unknown error"}`);
  if (process.env.NODE_ENV !== "production" && standardError?.stack) {
    console.error(`Stack: ${standardError.stack}`);
  }

  // Ensure a consistent JSON response
  response.setHeader("Content-Type", "application/json; charset=utf-8");

  if (errorObject instanceof AppError) {
    const status =
      (errorObject as any).statusCode ??
      (errorObject as any).httpStatus ??
      HTTP_STATUS.INTERNAL_SERVER_ERROR;

    const code = (errorObject as any).code ?? "APP_ERROR";

    response.status(status).json(
      errorResponse(standardError.message, code)
    );
    return;
  }

  response
    .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
    .json(errorResponse("An unexpected error occurred", "UNKNOWN_ERROR"));
}
