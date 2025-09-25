import { NextFunction, Request, Response } from "express";

import { StatusCodesEnum } from "../enums/status-codes.enum";
import { ITokenPayload } from "../interfaces/token.interface";
import { tokenRepository } from "../repositories/token.repository";
import { authService } from "../services/auth.service";
import { tokenService } from "../services/token.service";
import { userService } from "../services/user.service";

class AuthController {
    public async signIn(req: Request, res: Response, next: NextFunction) {
        try {
            const { email, password } = req.body;
            const user = await authService.signIn({ email, password });
            res.json(user).status(StatusCodesEnum.OK);
        } catch (e) {
            next(e);
        }
    }
    public async me(req: Request, res: Response, next: NextFunction) {
        try {
            const tokenPayload = res.locals.tokenPayload as ITokenPayload;
            const { userId } = tokenPayload;
            const user = await userService.getById(userId);
            res.status(StatusCodesEnum.OK).json(user);
        } catch (e) {
            next(e);
        }
    }
    public async refresh(req: Request, res: Response, next: NextFunction) {
        try {
            const { role, userId } = req.res.locals
                .tokenPayload as ITokenPayload;
            const tokens = tokenService.generateTokens({ role, userId });

            await tokenRepository.create({
                ...tokens,
                _userId: userId,
            });
            res.status(StatusCodesEnum.OK).json({ tokens });
        } catch (e) {
            next(e);
        }
    }
    public async createManager(
        req: Request,
        res: Response,
        next: NextFunction,
    ) {
        try {
            const manager = req.body;
            const createdManager = await authService.createManager(manager);
            res.status(StatusCodesEnum.CREATED).json(createdManager);
        } catch (e) {
            next(e);
        }
    }
}

export const authController = new AuthController();
