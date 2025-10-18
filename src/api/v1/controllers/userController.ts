import { Request, Response, NextFunction } from "express";
import { UserRecord } from "firebase-admin/auth";
import { auth } from "../../../../config/firebaseConfig";
import { successResponse } from "../models/responseModel";
import { HTTP_STATUS } from "../../../constants/httpConstants";

/**
 * Returns the current authenticated user's lightweight profile based on token.
 * Requires the authentication middleware to populate res.locals.uid and res.locals.role.
 */
export const getUserProfile = (
  request: Request,
  response: Response,
  nextFunction: NextFunction
): void => {
  try {
    const userId: string | undefined = response.locals.uid;
    const userRole: string | undefined = response.locals.role;

    if (!userId) {
      response.status(HTTP_STATUS.UNAUTHORIZED).json({
        status: "error",
        error: { message: "User not authenticated" },
      });
      return;
    }

    response.status(HTTP_STATUS.OK).json(
      successResponse(
        {
          userId,
          role: userRole ?? null,
        },
        "Authenticated user profile"
      )
    );
  } catch (unknownError: unknown) {
    nextFunction(unknownError);
  }
};

/**
 * Retrieves a Firebase Auth user by id (admin or same user).
 */
export const getUserDetails = async (
  request: Request,
  response: Response,
  nextFunction: NextFunction
): Promise<void> => {
  try {
    const { id } = request.params;
    const userRecord: UserRecord = await auth.getUser(id);

    response.status(HTTP_STATUS.OK).json(
      successResponse(userRecord, "User details retrieved from Firebase Auth")
    );
  } catch (unknownError: unknown) {
    nextFunction(unknownError);
  }
};
