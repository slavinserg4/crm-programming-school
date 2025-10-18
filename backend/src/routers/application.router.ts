import { Router } from "express";

import { applicationController } from "../controllers/application.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();
router.get("/", authMiddleware.checkAccessToken, applicationController.getAll);
router.get(
    "/:id",
    authMiddleware.checkAccessToken,
    applicationController.getById,
);
router.patch(
    "/update/:id",
    authMiddleware.checkAccessToken,
    applicationController.update,
);
router.patch(
    "/addcomm/:id",
    authMiddleware.checkAccessToken,
    applicationController.addComment,
);
export const applicationRouter = router;
