import { Types } from "mongoose";

import { ApplicationStatus } from "../enums/application-status-enum";
import {
    IApplication,
    IApplicationQuery,
    IApplicationUpdate,
} from "../interfaces/application.interface";
import { Application } from "../models/application.model";

class ApplicationRepository {
    public getAll(query: IApplicationQuery): Promise<[IApplication[], number]> {
        const {
            page = 1,
            pageSize = 25,
            sort = "createdAt",
            order = "desc",
            myApplications,
            manager,
            startDate,
            endDate,
            minSum,
            maxSum,
            minPaid,
            maxPaid,
            ...filters
        } = query;

        const filterQuery: any = {};

        // Базова фільтрація тексту
        Object.keys(filters).forEach((key) => {
            if (filters[key]) {
                if (["name", "surname", "email", "phone"].includes(key)) {
                    filterQuery[key] = { $regex: filters[key], $options: "i" };
                } else {
                    filterQuery[key] = filters[key];
                }
            }
        });

        // Фільтрація по датах
        if (startDate || endDate) {
            filterQuery.createdAt = {};
            if (startDate) filterQuery.createdAt.$gte = new Date(startDate);
            if (endDate) filterQuery.createdAt.$lte = new Date(endDate);
        }

        // Фільтрація по сумах
        if (minSum || maxSum) {
            filterQuery.sum = {};
            if (minSum) filterQuery.sum.$gte = minSum;
            if (maxSum) filterQuery.sum.$lte = maxSum;
        }

        // Фільтрація по вже оплаченим сумам
        if (minPaid || maxPaid) {
            filterQuery.already_paid = {};
            if (minPaid) filterQuery.already_paid.$gte = minPaid;
            if (maxPaid) filterQuery.already_paid.$lte = maxPaid;
        }

        // Фільтрація власних заявок менеджера
        if (myApplications && manager) {
            filterQuery.manager = new Types.ObjectId(manager);
        }

        const skip = (page - 1) * pageSize;

        return Promise.all([
            Application.find(filterQuery)
                .populate("manager", "firstName email")
                .populate("comments")
                .sort({ [sort]: order === "asc" ? 1 : -1 })
                .skip(skip)
                .limit(pageSize),
            Application.countDocuments(filterQuery),
        ]);
    }

    public getById(id: string): Promise<IApplication> {
        return Application.findById(id)
            .populate("manager", "name surname email")
            .populate("comments");
    }

    public updateOne(
        id: string,
        data: IApplicationUpdate,
        userId: string,
    ): Promise<IApplication> {
        return Application.findByIdAndUpdate(
            id,
            { $set: data, manager: userId },
            { new: true },
        )
            .populate("manager", "firstName email")
            .populate("comments");
    }

    public addComment(
        id: string,
        commentId: string,
        managerId: string,
    ): Promise<IApplication> {
        return Application.findByIdAndUpdate(
            id,
            {
                $push: { comments: commentId },
                $set: {
                    manager: managerId,
                    status: ApplicationStatus.IN_WORK,
                },
            },
            { new: true },
        ).populate("manager comments");
    }
}

export const applicationRepository = new ApplicationRepository();
