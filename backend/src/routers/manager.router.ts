import { Router } from "express";

import { managerController } from "../controllers/manager.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { commonMiddleware } from "../middlewares/common.middleware";
import { ManagerValidator } from "../validators/manager.validator";

const router = Router();
router.get(
    "/admins",
    authMiddleware.checkAccessToken,
    authMiddleware.IsUserAdmin,
    commonMiddleware.validateQuery(ManagerValidator.paginationSchema),
    managerController.managersByAdmin,
);

router.post(
    "/create",
    authMiddleware.checkAccessToken,
    authMiddleware.IsUserAdmin,
    commonMiddleware.validateBody(ManagerValidator.create),
    managerController.createManager,
);

router.post(
    "/activate-request/:id",
    authMiddleware.checkAccessToken,
    authMiddleware.IsUserAdmin,
    commonMiddleware.isIdValidate("id"),
    managerController.activateRequest,
);

router.patch(
    "/activate/:token",
    commonMiddleware.validateBody(ManagerValidator.activateAndRecovery),
    managerController.activate,
);

router.post(
    "/recovery-request/:id",
    authMiddleware.checkAccessToken,
    authMiddleware.IsUserAdmin,
    commonMiddleware.isIdValidate("id"),
    managerController.passwordRecoveryRequest,
);

router.post(
    "/recovery/:token",
    commonMiddleware.validateBody(ManagerValidator.activateAndRecovery),
    managerController.recovery,
);

router.patch(
    "/ban/:id",
    authMiddleware.checkAccessToken,
    authMiddleware.IsUserAdmin,
    commonMiddleware.isIdValidate("id"),
    managerController.ban,
);

router.patch(
    "/unban/:id",
    authMiddleware.checkAccessToken,
    authMiddleware.IsUserAdmin,
    commonMiddleware.isIdValidate("id"),
    managerController.unban,
);

export const managerRoute = router;
