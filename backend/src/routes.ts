import { Router } from "express";
import authController from "./controllers/authController";

const router = Router();

// Authentication Routes
router.post("/auth/signup", authController.signup);
router.post("/auth/login", authController.login);

export default router;
