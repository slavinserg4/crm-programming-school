import { config } from "../config/config";
import { emailConstants } from "../constants/email.constants";
import { ActionTokenTypeEnum } from "../enums/action-token-type.enum";
import { EmailEnum } from "../enums/email.enum";
import { StatusCodesEnum } from "../enums/status-codes.enum";
import { ApiError } from "../errors/api.error";
import { IPasswordReset } from "../interfaces/auth.interface";
import { IManagerQuery } from "../interfaces/manager.interface";
import { IPaginatedResponse } from "../interfaces/paginated-response.interface";
import { IManagerCreate, IUser } from "../interfaces/user.interface";
import { userRepository } from "../repositories/user.repository";
import { emailService } from "./email.service";
import { passwordService } from "./password.service";
import { tokenService } from "./token.service";

class ManagerService {
    public async createManager(
        manager: IManagerCreate,
        userId: string,
    ): Promise<IUser> {
        return await userRepository.createManager(manager, userId);
    }
    public async getAdminManagers(
        query: IManagerQuery,
        userId: string,
    ): Promise<IPaginatedResponse<IUser>> {
        const [data, totalItems] = await userRepository.getAll(query, userId);
        const totalPages = Math.ceil(totalItems / query.pageSize);
        const currentPage = query.page || 1;
        return {
            totalItems,
            totalPages,
            prevPage: currentPage > 1,
            nextPage: currentPage < totalPages,
            data,
        };
    }
    public async activateRequest(id: string): Promise<void> {
        const manager = await userRepository.getUserById(id);
        if (!manager) {
            throw new Error("Manager not found");
        }
        const token = tokenService.generateActionToken(
            { userId: manager._id, role: manager.role },
            ActionTokenTypeEnum.ACTIVATE,
        );
        const url = `${config.FRONTEND_URL}/activate/${token}`;
        await emailService.sendEmail(
            manager.email,
            emailConstants[EmailEnum.ACTIVATE],
            { url, name: manager.firstName },
        );
    }
    public async activate(token: string): Promise<IUser> {
        const { userId } = tokenService.verifyToken(
            token,
            ActionTokenTypeEnum.ACTIVATE,
        );
        return await userRepository.updateById(userId, {
            isActive: true,
        });
    }
    public async passwordRecoveryRequest(id: string): Promise<void> {
        const manager = await userRepository.getUserById(id);
        if (!manager) {
            throw new Error("Manager not found");
        }
        const token = tokenService.generateActionToken(
            { userId: manager._id, role: manager.role },
            ActionTokenTypeEnum.RECOVERY,
        );
        const url = `${config.FRONTEND_URL}/recovery/${token}`;
        await emailService.sendEmail(
            manager.email,
            emailConstants[EmailEnum.RECOVERY],
            { url },
        );
    }
    public async recovery(
        token: string,
        passwords: IPasswordReset,
    ): Promise<IUser> {
        const { userId } = tokenService.verifyToken(
            token,
            ActionTokenTypeEnum.RECOVERY,
        );
        if (passwords.firstPassword !== passwords.secondPassword) {
            throw new ApiError(
                "Passwords do not match",
                StatusCodesEnum.BED_REQUEST,
            );
        }
        const password = await passwordService.hashPassword(
            passwords.secondPassword,
        );
        return await userRepository.updateById(userId, {
            password,
        });
    }
    public async ban(id: string): Promise<void> {
        await userRepository.updateById(id, {
            isBanned: true,
        });
    }
    public async unban(id: string): Promise<void> {
        await userRepository.updateById(id, {
            isBanned: false,
        });
    }
}
export const managerService = new ManagerService();
