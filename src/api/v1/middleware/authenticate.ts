import { Request, Response, NextFunction } from "express";
import { DecodedIdToken } from "firebase-admin/auth";
import { auth } from "../../../../config/firebaseConfig";
import { AuthenticationError } from "../errors/errors";
import { getErrorMessage, getErrorCode } from "../utils/errorUtils";

/**
 * Verifies Firebase ID token and attaches user context to `response.locals`.
 *
 * Expected header: `Authorization: Bearer <token>`
 * On success:
 * - `response.locals.uid` is set to the user's UID.
 * - `response.locals.role` is set from custom claims if present.
 *
 * @param request - Express request.
 * @param response - Express response.
 * @param nextFunction - Next middleware.
 */
const authenticate = async (
  request: Request,
  response: Response,
  nextFunction: NextFunction
): Promise<void> => {
  try {
    const authorizationHeader: string | undefined = request.headers.authorization;

    const token: string | undefined =
      authorizationHeader?.startsWith("Bearer ")
        ? authorizationHeader.split(" ")[1]
        : undefined;

    if (!token) {
      throw new AuthenticationError("Unauthorized: No token provided", "TOKEN_NOT_FOUND");
    }

    const decoded: DecodedIdToken = await auth.verifyIdToken(token);

    // Attach user context for subsequent middleware/routes
    response.locals.uid = decoded.uid;
    // Custom claims: e.g., { role: 'admin' }
    response.locals.role = (decoded as unknown as { role?: string }).role;

    nextFunction();
  } catch (unknownError: unknown) {
    if (unknownError instanceof AuthenticationError) {
      nextFunction(unknownError);
      return;
    }

    nextFunction(
      new AuthenticationError(
        `Unauthorized: ${getErrorMessage(unknownError)}`,
        getErrorCode(unknownError)
      )
    );
  }
};

export default authenticate;
