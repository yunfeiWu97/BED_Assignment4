/**
 * Unit: Global error handler formatting for AppError and unexpected errors.
 * - No abbreviations in route paths or variable names.
 */
import express, { Request, Response } from "express";
import supertest from "supertest";
import errorHandler from "../src/api/v1/middleware/errorHandler";
import { AppError } from "../src/api/v1/errors/errors";
import { HTTP_STATUS } from "../src/constants/httpConstants";

describe("Global error handler", () => {
  it("formats AppError with explicit code and statusCode", async () => {
    const applicationUnderTest = express();

    applicationUnderTest.get(
      "/simulate-forbidden-error",
      (_requestObject: Request, _responseObject: Response) => {
        throw new AppError(
          "Forbidden: No role found",
          "ROLE_NOT_FOUND",
          HTTP_STATUS.FORBIDDEN
        );
      }
    );

    applicationUnderTest.use(errorHandler);

    const httpResponse = await supertest(applicationUnderTest).get(
      "/simulate-forbidden-error"
    );

    expect(httpResponse.status).toBe(HTTP_STATUS.FORBIDDEN);
    expect(httpResponse.body.status).toBe("error");
    expect(httpResponse.body.error.code).toBe("ROLE_NOT_FOUND");
    expect(httpResponse.body.error.message).toMatch(/forbidden/i);
    expect(typeof httpResponse.body.timestamp).toBe("string");
  });

  it("formats unexpected errors as UNKNOWN_ERROR with 500 status", async () => {
    const applicationUnderTest = express();

    applicationUnderTest.get(
      "/simulate-unexpected-error",
      (_requestObject: Request, _responseObject: Response) => {
        throw new Error("Third-party library error");
      }
    );

    applicationUnderTest.use(errorHandler);

    const httpResponse = await supertest(applicationUnderTest).get(
      "/simulate-unexpected-error"
    );

    expect(httpResponse.status).toBe(HTTP_STATUS.INTERNAL_SERVER_ERROR);
    expect(httpResponse.body.status).toBe("error");
    expect(httpResponse.body.error.code).toBe("UNKNOWN_ERROR");
    expect(httpResponse.body.error.message).toMatch(/unexpected|error/i);
    expect(typeof httpResponse.body.timestamp).toBe("string");
  });
});
