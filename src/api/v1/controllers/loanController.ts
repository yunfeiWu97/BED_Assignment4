import { Request, Response, NextFunction } from "express";
import { successResponse } from "../models/responseModel";
import { HTTP_STATUS } from "../../../constants/httpConstants";
import { Loan, UpdateLoanRequest } from "../types/loanTypes";

/**
 * Create a new loan (hardcoded response for assignment scaffolding).
 * Only roles: admin, officer.
 */
export const createLoan = async (
  request: Request,
  response: Response,
  _next: NextFunction
): Promise<void> => {
  const userId: string = response.locals.uid;

  const loan: Loan = {
    id: "LN-001",
    applicantName: request.body?.applicantName ?? "John Doe",
    amount: Number(request.body?.amount ?? 50000),
    status: "PENDING",
    createdByUserId: userId,
    createdAtIso: new Date().toISOString(),
  };

  response.status(HTTP_STATUS.CREATED).json(
    successResponse(loan, "Loan was created (hardcoded response).")
  );
};

/**
 * Get all loans (hardcoded array for assignment scaffolding).
 * Roles: admin, officer, manager.
 */
export const getAllLoans = async (
  _request: Request,
  response: Response,
  _next: NextFunction
): Promise<void> => {
  const loans: Loan[] = [
    {
      id: "LN-001",
      applicantName: "John Doe",
      amount: 50000,
      status: "PENDING",
      createdByUserId: "uid-demo",
      createdAtIso: new Date().toISOString(),
    },
    {
      id: "LN-002",
      applicantName: "Jane Smith",
      amount: 80000,
      status: "REVIEWED",
      createdByUserId: "uid-demo",
      createdAtIso: new Date().toISOString(),
    },
  ];

  response.status(HTTP_STATUS.OK).json(
    successResponse(loans, "Fetched loans (hardcoded response).")
  );
};

/**
 * Get a single loan by id (hardcoded for assignment scaffolding).
 * Roles: admin, officer, manager.
 */
export const getLoanById = async (
  request: Request,
  response: Response,
  _next: NextFunction
): Promise<void> => {
  const loanId = request.params.id;

  const loan: Loan = {
    id: loanId,
    applicantName: "John Doe",
    amount: 50000,
    status: "PENDING",
    createdByUserId: "uid-demo",
    createdAtIso: new Date().toISOString(),
  };

  response.status(HTTP_STATUS.OK).json(
    successResponse(loan, "Fetched loan (hardcoded response).")
  );
};

/**
 * Update a loan (review/approve). Hardcoded echo for assignment scaffolding.
 * Roles: manager (review) or admin (final decisions).
 */
export const updateLoan = async (
  request: Request,
  response: Response,
  _next: NextFunction
): Promise<void> => {
  const loanId = request.params.id;
  const payload: UpdateLoanRequest = request.body ?? {};

  const updated: Loan & UpdateLoanRequest = {
    id: loanId,
    applicantName: "John Doe",
    amount: 50000,
    status: payload.status ?? "REVIEWED",
    createdByUserId: "uid-demo",
    createdAtIso: new Date().toISOString(),
    reviewerNote: payload.reviewerNote ?? "Reviewed by manager",
  };

  response.status(HTTP_STATUS.OK).json(
    successResponse(updated, "Loan was updated (hardcoded response).")
  );
};

/**
 * Reviews a specific loan application (assignment hardcoded stub).
 * Role: officer
 */
export const reviewLoan = async (
  request: Request,
  response: Response,
  _next: NextFunction
): Promise<void> => {
  const { id } = request.params;

  response.status(HTTP_STATUS.OK).json(
    successResponse(
      { id, reviewed: true },
      "Loan application reviewed (hardcoded response)."
    )
  );
};

/**
 * Approves a specific loan application (assignment hardcoded stub).
 * Role: manager
 */
export const approveLoan = async (
  request: Request,
  response: Response,
  _next: NextFunction
): Promise<void> => {
  const { id } = request.params;

  response.status(HTTP_STATUS.OK).json(
    successResponse(
      { id, approved: true },
      "Loan application approved (hardcoded response)."
    )
  );
};

/**
 * Delete a loan (hardcoded for assignment scaffolding).
 * Role: admin.
 */
export const deleteLoan = async (
  request: Request,
  response: Response,
  _next: NextFunction
): Promise<void> => {
  const loanId = request.params.id;

  response.status(HTTP_STATUS.OK).json(
    successResponse(
      { id: loanId },
      "Loan was deleted (hardcoded response)."
    )
  );
};
