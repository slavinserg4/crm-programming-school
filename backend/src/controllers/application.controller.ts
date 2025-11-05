import { NextFunction, Request, Response } from "express";

import { StatusCodesEnum } from "../enums/status-codes.enum";
import { ApiError } from "../errors/api.error";
import {
    IApplicationQuery,
    IApplicationUpdate,
} from "../interfaces/application.interface";
import { ITokenPayload } from "../interfaces/token.interface";
import { applicationsService } from "../services/applications.service";

class ApplicationController {
    public async getApplicationsStatistics(
        req: Request,
        res: Response,
        next: NextFunction,
    ) {
        try {
            const response =
                await applicationsService.getApplicationsStatistics();
            res.json(response).status(StatusCodesEnum.OK);
        } catch (e) {
            next(e);
        }
    }
    public async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const query = req.query as any as IApplicationQuery;
            const response = await applicationsService.getAll(query);
            res.json(response).status(StatusCodesEnum.OK);
        } catch (e) {
            next(e);
        }
    }
    public async getById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const response = await applicationsService.getById(id);
            res.json(response).status(StatusCodesEnum.OK);
        } catch (e) {
            next(e);
        }
    }
    public async update(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const { userId } = res.locals.tokenPayload as ITokenPayload;
            const updateData = req.body as IApplicationUpdate;

            const updated = await applicationsService.updateOne(
                id,
                userId,
                updateData,
            );
            return res.json(updated);
        } catch (error) {
            throw new ApiError(error.message, error.status || 500);
        }
    }

    public async addComment(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const { userId } = res.locals.tokenPayload as ITokenPayload;
            const { text } = req.body;

            const updated = await applicationsService.addComment(
                id,
                text,
                userId,
            );
            return res.status(StatusCodesEnum.OK).json(updated);
        } catch (error) {
            next(error);
        }
    }
}
export const applicationController = new ApplicationController();
