import { Router } from "express";

import { applicationRouter } from "./application.router";
import { authRouter } from "./auth.router";
import { managerRouter } from "./manager.router";

const router = Router();
router.use("/auth", authRouter);
router.use("/manager", managerRouter);
router.use("/applications", applicationRouter);
export const apiRouter = router;
