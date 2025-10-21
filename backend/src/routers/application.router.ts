import { Router } from "express";

import { applicationController } from "../controllers/application.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { commonMiddleware } from "../middlewares/common.middleware";
import { ApplicationValidator } from "../validators/application.validator";

const router = Router();

router.get(
    "/",
    authMiddleware.checkAccessToken,
    commonMiddleware.validateQuery(ApplicationValidator.getAll),
    applicationController.getAll,
);

router.get(
    "/:id",
    authMiddleware.checkAccessToken,
    commonMiddleware.isIdValidate("id"),
    applicationController.getById,
);

router.patch(
    "/update/:id",
    authMiddleware.checkAccessToken,
    commonMiddleware.isIdValidate("id"),
    commonMiddleware.validateBody(ApplicationValidator.update),
    applicationController.update,
);

router.patch(
    "/addcomm/:id",
    authMiddleware.checkAccessToken,
    commonMiddleware.isIdValidate("id"),
    commonMiddleware.validateBody(ApplicationValidator.addComment),
    applicationController.addComment,
);

export const applicationRouter = router;
