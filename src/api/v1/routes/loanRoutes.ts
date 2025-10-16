import { Router } from "express";
import authenticate from "../middleware/authenticate";
import authorize from "../middleware/authorize";
import {
  createLoan,
  getAllLoans,
  getLoanById,
  updateLoan,
  deleteLoan,
} from "../controllers/loanController";

/**
 * Routes for managing high-risk loan applications.
 * All routes are protected by authentication first, then role-based authorization.
 */
const loanRoutes: Router = Router();

/**
 * Apply authentication to all loan routes.
 * Requires a valid Firebase ID token (set by the authentication middleware).
 */
loanRoutes.use(authenticate);

/**
 * Create a new loan application.
 * Access: admin, officer
 * POST /api/v1/loans
 */
loanRoutes.post(
  "/",
  authorize({ hasRole: ["admin", "officer"] }),
  createLoan
);

/**
 * Get all loan applications.
 * Access: admin, officer, manager
 * GET /api/v1/loans
 */
loanRoutes.get(
  "/",
  authorize({ hasRole: ["admin", "officer", "manager"] }),
  getAllLoans
);

/**
 * Get a single loan application by id.
 * Access: admin, officer, manager
 * GET /api/v1/loans/:id
 */
loanRoutes.get(
  "/:id",
  authorize({ hasRole: ["admin", "officer", "manager"] }),
  getLoanById
);

/**
 * Update an existing loan application by id.
 * Access: manager, admin
 * PATCH /api/v1/loans/:id
 */
loanRoutes.patch(
  "/:id",
  authorize({ hasRole: ["manager", "admin"] }),
  updateLoan
);

/**
 * Delete a loan application by id.
 * Access: admin
 * DELETE /api/v1/loans/:id
 */
loanRoutes.delete(
  "/:id",
  authorize({ hasRole: ["admin"] }),
  deleteLoan
);

export default loanRoutes;