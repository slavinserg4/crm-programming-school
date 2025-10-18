import { StatusCodesEnum } from "../enums/status-codes.enum";
import { ApiError } from "../errors/api.error";
import {
    IApplication,
    IApplicationQuery,
    IApplicationUpdate,
} from "../interfaces/application.interface";
import { IPaginatedResponse } from "../interfaces/paginated-response.interface";
import { applicationRepository } from "../repositories/application.repository";
import { commentRepository } from "../repositories/comment.repository";
import { userRepository } from "../repositories/user.repository";

class ApplicationsService {
    private normalizeId(id: any): string {
        if (!id) return null;
        if (typeof id === "string") return id;
        if (typeof id.toString === "function") return id.toString();
        return id;
    }

    public async getAll(
        query: IApplicationQuery,
    ): Promise<IPaginatedResponse<IApplication>> {
        const [data, totalItems] = await applicationRepository.getAll(query);
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
    public async getById(id: string): Promise<IApplication> {
        const application = await applicationRepository.getById(id);
        if (!application) {
            throw new ApiError(
                "Application not found",
                StatusCodesEnum.NOT_FOUND,
            );
        }
        return await applicationRepository.getById(id);
    }
    public async updateOne(
        id: string,
        userId: string,
        dto: IApplicationUpdate,
    ): Promise<IApplication> {
        const application = await this.getById(id);

        const applicationManagerId = application.manager
            ? this.normalizeId(application.manager._id)
            : null;

        if (application.manager !== null && applicationManagerId !== userId) {
            throw new ApiError(
                "You can only update your own applications",
                StatusCodesEnum.FORBIDDEN,
            );
        }

        await userRepository.addApplicationToUser(userId, application._id);
        return await applicationRepository.updateOne(id, dto, userId);
    }

    public async addComment(
        id: string,
        managerId: string,
        text: string,
    ): Promise<IApplication> {
        const application = await this.getById(id);

        const applicationManagerId = application.manager
            ? this.normalizeId(application.manager._id)
            : null;

        if (
            application.manager !== null &&
            applicationManagerId !== managerId
        ) {
            throw new ApiError(
                "You can only update your own applications",
                StatusCodesEnum.FORBIDDEN,
            );
        }

        const newComment = await commentRepository.create({
            applicationId: id,
            text,
            author: managerId,
        });
        await userRepository.addApplicationToUser(managerId, application._id);
        return await applicationRepository.addComment(
            id,
            newComment._id.toString(),
            managerId,
        );
    }
}
export const applicationsService = new ApplicationsService();
