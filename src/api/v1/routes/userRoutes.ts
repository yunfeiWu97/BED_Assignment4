import express, { Router } from "express";
import authenticate from "../middleware/authenticate";
import isAuthorized from "../middleware/authorize";
import { getUserDetails, getUserProfile } from "../controllers/userController";

const router: Router = express.Router();

/** GET /api/v1/users/profile — current user profile (auth only) */
router.get("/profile", authenticate, getUserProfile);

/** GET /api/v1/users/:id — admin or same user can access */
router.get(
  "/:id",
  authenticate,
  isAuthorized({ hasRole: ["admin"], allowSameUser: true }),
  getUserDetails
);

export default router;
