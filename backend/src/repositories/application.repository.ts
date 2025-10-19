import { Types } from "mongoose";

import { ApplicationStatus } from "../enums/application-status-enum";
import {
    IApplication,
    IApplicationQuery,
    IApplicationUpdate,
} from "../interfaces/application.interface";
import { Application } from "../models/application.model";
import { User } from "../models/user.model";

class ApplicationRepository {
    public async getAll(
        query: IApplicationQuery,
    ): Promise<[IApplication[], number]> {
        const {
            page = 1,
            pageSize = 25,
            sort = "createdAt",
            order = "desc",
            name,
            surname,
            email,
            phone,
            age,
            course,
            course_type,
            course_format,
            status,
            group,
            manager,
            startDate,
            endDate,
        } = query;

        const filterQuery: any = {};

        // Текстовий пошук
        if (name) filterQuery.name = { $regex: name, $options: "i" };
        if (surname) filterQuery.surname = { $regex: surname, $options: "i" };
        if (email) filterQuery.email = { $regex: email, $options: "i" };
        if (phone) filterQuery.phone = { $regex: phone, $options: "i" };

        // Пошук по менеджеру
        if (manager) {
            const managerFilter = {
                firstName: { $regex: manager, $options: "i" },
            };
            const managers = await User.find(managerFilter);
            const managerIds = managers.map((m) => m._id);
            filterQuery.manager = { $in: managerIds };
        }

        // Інші фільтри залишаються без змін
        if (age) filterQuery.age = age;
        if (course) filterQuery.course = course;
        if (course_type) filterQuery.course_type = course_type;
        if (course_format) filterQuery.course_format = course_format;
        if (status) filterQuery.status = status;
        if (group) filterQuery.group = new Types.ObjectId(group);

        // Фільтрація по датах
        if (startDate || endDate) {
            filterQuery.createdAt = {};
            if (startDate) filterQuery.createdAt.$gte = new Date(startDate);
            if (endDate) filterQuery.createdAt.$lte = new Date(endDate);
        }

        const skip = (page - 1) * pageSize;

        return await Promise.all([
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
        )
            .populate("manager", "firstName email _id")
            .populate("comments");
    }
}

export const applicationRepository = new ApplicationRepository();
