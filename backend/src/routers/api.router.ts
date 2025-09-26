import { Router } from "express";

import { authRouter } from "./auth.router";
import { managerRouter } from "./manager.router";

const router = Router();
router.use("/auth", authRouter);
router.use("/manager", managerRouter);
export const apiRouter = router;
