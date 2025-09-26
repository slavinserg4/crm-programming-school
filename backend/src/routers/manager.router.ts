import { Router } from "express";

import { managerController } from "../controllers/manager.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();
router.get(
    "/admins",
    authMiddleware.checkAccessToken,
    authMiddleware.IsUserAdmin,
    managerController.managersByAdmin,
);
router.post(
    "/create",
    authMiddleware.checkAccessToken,
    authMiddleware.IsUserAdmin,
    managerController.createManager,
);
router.post(
    "/activate-request/:id",
    authMiddleware.checkAccessToken,
    authMiddleware.IsUserAdmin,
    managerController.activateRequest,
);

router.patch("/activate/:token", managerController.activate);
router.post(
    "/recovery-request/:id",
    authMiddleware.checkAccessToken,
    authMiddleware.IsUserAdmin,
    managerController.passwordRecoveryRequest,
);
router.post("/recovery/:token", managerController.recovery);
router.patch(
    "/ban/:id",
    authMiddleware.checkAccessToken,
    authMiddleware.IsUserAdmin,
    managerController.ban,
);
router.patch(
    "/unban/:id",
    authMiddleware.checkAccessToken,
    authMiddleware.IsUserAdmin,
    managerController.unban,
);

export const managerRouter = router;
