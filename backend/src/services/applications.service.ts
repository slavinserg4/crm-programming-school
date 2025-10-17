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

class ApplicationsService {
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
        if (application.manager.toString() !== userId.toString())
            throw new ApiError(
                "You can only update your own applications",
                StatusCodesEnum.FORBIDDEN,
            );

        return await applicationRepository.updateOne(id, dto);
    }
    public async addComment(
        id: string,
        text: string,
        managerId: string,
    ): Promise<IApplication> {
        const application = await this.getById(id);
        if (application.manager.toString() !== managerId.toString())
            throw new ApiError(
                "You can only update your own applications",
                StatusCodesEnum.FORBIDDEN,
            );
        const newComment = await commentRepository.create({
            applicationId: id,
            text,
            author: managerId,
        });

        return await applicationRepository.addComment(
            id,
            newComment._id.toString(),
            managerId,
        );
    }
}
export const applicationsService = new ApplicationsService();
