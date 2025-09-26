import { NextFunction, Request, Response } from "express";

import { StatusCodesEnum } from "../enums/status-codes.enum";
import { IPasswordReset } from "../interfaces/auth.interface";
import { IManagerQuery } from "../interfaces/manager.interface";
import { ITokenPayload } from "../interfaces/token.interface";
import { managerService } from "../services/manager.service";

class ManagerController {
    public async createManager(
        req: Request,
        res: Response,
        next: NextFunction,
    ) {
        try {
            const manager = req.body;
            const { userId } = req.res.locals.tokenPayload as ITokenPayload;
            const createdManager = await managerService.createManager(
                manager,
                userId,
            );
            res.status(StatusCodesEnum.CREATED).json(createdManager);
        } catch (e) {
            next(e);
        }
    }
    public async managersByAdmin(
        req: Request,
        res: Response,
        next: NextFunction,
    ) {
        try {
            const query = req.query as any as IManagerQuery;
            const { userId } = req.res.locals.tokenPayload as ITokenPayload;
            const data = await managerService.getAdminManagers(query, userId);
            res.status(StatusCodesEnum.OK).json(data);
        } catch (e) {
            next(e);
        }
    }
    public async activateRequest(
        req: Request,
        res: Response,
        next: NextFunction,
    ) {
        try {
            const { id } = req.params;
            await managerService.activateRequest(id);
            res.status(StatusCodesEnum.OK).json({
                message: "Check manager's email",
            });
        } catch (e) {
            next(e);
        }
    }
    public async activate(req: Request, res: Response, next: NextFunction) {
        try {
            const { token } = req.params;
            const manager = await managerService.activate(token);
            res.status(StatusCodesEnum.OK).json(manager);
        } catch (e) {
            next(e);
        }
    }
    public async passwordRecoveryRequest(
        req: Request,
        res: Response,
        next: NextFunction,
    ) {
        try {
            const { id } = req.params;
            await managerService.passwordRecoveryRequest(id);
            res.status(StatusCodesEnum.OK).json({
                message: "Check manager's email",
            });
        } catch (e) {
            next(e);
        }
    }
    public async recovery(req: Request, res: Response, next: NextFunction) {
        try {
            const { token } = req.params;
            const { firstPassword, secondPassword } =
                req.body as IPasswordReset;
            const manager = await managerService.recovery(token, {
                firstPassword,
                secondPassword,
            });
            res.status(StatusCodesEnum.OK).json(manager);
        } catch (e) {
            next(e);
        }
    }
    public async ban(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            await managerService.ban(id);
            res.status(StatusCodesEnum.OK).json({ "Manager banned": "true" });
        } catch (e) {
            next(e);
        }
    }
    public async unban(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            await managerService.unban(id);
            res.status(StatusCodesEnum.OK).json({ "Manager unbanned": "true" });
        } catch (e) {
            next(e);
        }
    }
}
export const managerController = new ManagerController();
