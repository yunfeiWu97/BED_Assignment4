import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/errors";
import { HTTP_STATUS } from "../../../constants/httpConstants";
import { errorResponse } from "../models/responseModel";

/**
 * Global error handler.
 *
 * Rules:
 * - Always responds with JSON (`application/json; charset=utf-8`).
 * - If the error is an `AppError`, use its `statusCode` and `code`.
 * - Otherwise respond with HTTP 500 and code `UNKNOWN_ERROR`.
 *
 * @param errorObject - Thrown error.
 * @param _request - Express request object (unused).
 * @param response - Express response object.
 * @param _nextFunction - Express next function (unused).
 */
export default function errorHandler(
  errorObject: unknown,
  _request: Request,
  response: Response,
  _nextFunction: NextFunction
): void {
  const standardError = errorObject as Error | undefined;

  // Log message always; stack only outside production
  console.error(`Error: ${standardError?.message ?? "Unknown error"}`);
  if (process.env.NODE_ENV !== "production" && standardError?.stack) {
    console.error(`Stack: ${standardError.stack}`);
  }

  response.setHeader("Content-Type", "application/json; charset=utf-8");

  if (errorObject instanceof AppError) {
    const httpStatus: number =
      (errorObject as any).statusCode ??
      (errorObject as any).httpStatus ??
      HTTP_STATUS.INTERNAL_SERVER_ERROR;

    const code: string = (errorObject as any).code ?? "APP_ERROR";

    // Keep order consistent with response model: message first, then code.
    response.status(httpStatus).json(
      errorResponse(errorObject.message, code)
    );
    return;
  }

  response
    .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
    .json(errorResponse("An unexpected error occurred", "UNKNOWN_ERROR"));
}
