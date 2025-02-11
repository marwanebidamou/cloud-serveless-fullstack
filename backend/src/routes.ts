import { Router } from "express";
import authController from "./controllers/authController";
import authMiddleware from "./middleware/authMiddleware";
import userController from "./controllers/userController";

const router = Router();

// Authentication Routes
router.post("/auth/signup", authController.signup);
router.post("/auth/login", authController.login);

// User Routes
router.get("/profile", authMiddleware, userController.getProfile);

router.get("/profile/upload-url", userController.getUploadUrl);

router.put("/profile", authMiddleware, userController.updateProfile);

export default router;
