import {
    IApplication,
    IApplicationQuery,
} from "../interfaces/application.interface";
import { IPaginatedResponse } from "../interfaces/paginated-response.interface";
import { applicationRepository } from "../repositories/application.repository";

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
        return await applicationRepository.getById(id);
    }
    public async updateOne(
        id: string,
        dto: Partial<IApplication>,
    ): Promise<IApplication> {
        return await applicationRepository.updateOne(id, dto);
    }
    public async addComment(
        id: string,
        commentId: string,
        managerId: string,
    ): Promise<IApplication> {
        return await applicationRepository.addComment(id, commentId, managerId);
    }
}
export const applicationsService = new ApplicationsService();
