/**
 * Represents a high-risk loan application in the system.
 */
export interface Loan {
  id: string;
  applicantName: string;
  amount: number;
  status: "PENDING" | "REVIEWED" | "APPROVED" | "REJECTED";
  createdByUserId: string;
  createdAtIso: string;
}

/**
 * DTO for updating a loan.
 */
export interface UpdateLoanRequest {
  status?: "REVIEWED" | "APPROVED" | "REJECTED";
  reviewerNote?: string;
}