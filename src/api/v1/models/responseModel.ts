/**
 * A standardized API response envelope.
 * @template T The type of the `data` payload.
 */
export interface ApiResponse<T> {
  /** Either "success" or "error". */
  status: "success" | "error";
  /** Optional data payload for successful responses. */
  data?: T;
  /** Optional human-readable message to accompany the response. */
  message?: string;
  /** Optional error details for failed responses. */
  error?: { message: string; code?: string };
  /** ISO timestamp when the response was generated. */
  timestamp?: string;
}

/**
 * Creates a standardized success response.
 * @typeParam T - The type of the response payload.
 * @param data - The data to include in the response.
 * @param message - Optional message to provide additional context.
 * @returns A standardized success {@link ApiResponse}.
 */
export const successResponse = <T>(
  data: T,
  message?: string
): ApiResponse<T> => ({
  status: "success",
  data,
  message,
});

/**
 * Creates a standardized error response.
 * Ensures that all API errors follow the same format.
 * @param message - A human-readable error message.
 * @param code - Optional machine-readable error code (e.g., "TOKEN_INVALID").
 * @returns A standardized error {@link ApiResponse}.
 */
export const errorResponse = (
  message: string,
  code?: string
): ApiResponse<null> => ({
  status: "error",
  error: { message, code },
  timestamp: new Date().toISOString(),
});
