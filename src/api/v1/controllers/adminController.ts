import { Request, Response, NextFunction } from "express";
import { auth } from "../../../../config/firebaseConfig";
import { HTTP_STATUS } from "../../../constants/httpConstants";
import { successResponse } from "../models/responseModel";

/**
 * Sets custom claims for a user in Firebase Authentication, e.g. { role: 'admin' }.
 * Body example:
 * {
 *   "uid": "user-uid",
 *   "claims": { "role": "officer" }
 * }
 */
export const setCustomClaims = async (
  request: Request,
  response: Response,
  nextFunction: NextFunction
): Promise<void> => {
  try {
    const { uid, claims } = request.body as { uid: string; claims: Record<string, unknown> };

    await auth.setCustomUserClaims(uid, claims);

    response
      .status(HTTP_STATUS.OK)
      .json(successResponse({}, `Custom claims set for user: ${uid}`));
  } catch (unknownError: unknown) {
    nextFunction(unknownError);
  }
};
