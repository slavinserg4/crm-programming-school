import { Router } from "express";

import { applicationRouter } from "./application.router";
import { authRouter } from "./auth.router";
import { managerRoute } from "./manager.router";

const router = Router();
router.use("/auth", authRouter);
router.use("/manager", managerRoute);
router.use("/applications", applicationRouter);
export const apiRouter = router;
