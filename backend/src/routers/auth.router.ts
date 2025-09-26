import { Router } from "express";

import { authController } from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.post("/sign-in", authController.signIn);
router.post(
    "/refresh",
    authMiddleware.checkRefreshToken,
    authController.refresh,
);
router.get("/me", authMiddleware.checkAccessToken, authController.me);

export const authRouter = router;
