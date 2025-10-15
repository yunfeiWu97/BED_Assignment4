import { Request, Response, NextFunction } from "express";
import { DecodedIdToken } from "firebase-admin/auth";
import { auth } from "../../../../config/firebaseConfig";
import { AuthenticationError } from "../errors/errors";
import { getErrorMessage, getErrorCode } from "../utils/errorUtils";

/**
 * Middleware that authenticates requests using a Firebase ID token.
 * - Extracts Bearer token from the Authorization header
 * - Verifies the token with Firebase Admin
 * - Stores user id and role in res.locals for downstream usage
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
