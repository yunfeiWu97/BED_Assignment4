import express, { Router } from "express";
import authenticate from "../middleware/authenticate";
// import isAuthorized from "../middleware/authorize";
import { setCustomClaims } from "../controllers/adminController";

const router: Router = express.Router();

/**
 * TEMPORARILY auth-only for bootstrap
 */
router.post("/setCustomClaims", authenticate, setCustomClaims);

export default router;
