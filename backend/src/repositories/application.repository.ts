import { ApplicationStatus } from "../enums/application-status-enum";
import {
    IApplication,
    IApplicationQuery,
    IApplicationUpdate,
} from "../interfaces/application.interface";
import { IManagerStats } from "../interfaces/manager.interface";
import { Application } from "../models/application.model";
import { User } from "../models/user.model";

class ApplicationRepository {
    private async buildQuery(query: IApplicationQuery, managerId?: string) {
        const {
            page = 1,
            pageSize = 25,
            sort,
            order = "asc",
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
        } = query;

        const filterQuery: any = {};

        if (name) filterQuery.name = { $regex: name, $options: "i" };
        if (surname) filterQuery.surname = { $regex: surname, $options: "i" };
        if (email) filterQuery.email = { $regex: email, $options: "i" };
        if (phone) filterQuery.phone = { $regex: phone, $options: "i" };
        if (age) filterQuery.age = age;
        if (course) filterQuery.course = course;
        if (course_type) filterQuery.course_type = course_type;
        if (course_format) filterQuery.course_format = course_format;
        if (status) filterQuery.status = status;
        if (group) filterQuery.group = group;

        if (managerId) {
            filterQuery.manager = managerId;
        } else if (manager) {
            const managers = await User.find({
                firstName: { $regex: manager, $options: "i" },
            });
            filterQuery.manager = { $in: managers.map((m) => m._id) };
        }

        const skip = (page - 1) * pageSize;

        return { filterQuery, skip, sort, order, pageSize };
    }

    public async getAll(
        query: IApplicationQuery,
    ): Promise<[IApplication[], number]> {
        const { filterQuery, skip, sort, order, pageSize } =
            await this.buildQuery(query);

        const dataPromise = Application.find(filterQuery)
            .populate("manager", "firstName email")
            .populate({
                path: "comments",
                populate: {
                    path: "author",
                    select: "firstName email createdAt",
                },
            })
            .sort({ [sort]: order === "asc" ? 1 : -1 })
            .skip(skip)
            .limit(pageSize);

        const countPromise = Application.countDocuments(filterQuery);

        return await Promise.all([dataPromise, countPromise]);
    }

    public async myApplications(
        query: IApplicationQuery,
        userId: string,
    ): Promise<[IApplication[], number]> {
        const { filterQuery, skip, sort, order, pageSize } =
            await this.buildQuery(query, userId);

        const dataPromise = Application.find(filterQuery)
            .populate("manager", "firstName email")
            .populate({
                path: "comments",
                populate: {
                    path: "author",
                    select: "firstName email createdAt",
                },
            })
            .sort({ [sort]: order === "asc" ? 1 : -1 })
            .skip(skip)
            .limit(pageSize);

        const countPromise = Application.countDocuments(filterQuery);

        return await Promise.all([dataPromise, countPromise]);
    }

    public getById(id: string): Promise<IApplication> {
        return Application.findById(id)
            .populate("manager", "name surname email")
            .populate({
                path: "comments",
                populate: {
                    path: "author",
                    select: "firstName email createdAt",
                },
            });
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
            .populate({
                path: "comments",
                populate: {
                    path: "author",
                    select: "firstName email createdAt",
                },
            });
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
            .populate({
                path: "comments",
                populate: {
                    path: "author",
                    select: "firstName email createdAt",
                },
            });
    }

    public async getApplicationsStatistics(): Promise<IManagerStats> {
        const pipeline = [
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 },
                },
            },
        ];

        const results = await Application.aggregate(pipeline);

        const statistics: IManagerStats = {
            total: 0,
            inWork: 0,
            new: 0,
            agree: 0,
            disagree: 0,
            dubbing: 0,
        };

        results.forEach(({ _id, count }) => {
            switch (_id) {
                case ApplicationStatus.IN_WORK:
                    statistics.inWork = count;
                    break;
                case ApplicationStatus.NEW:
                    statistics.new = count;
                    break;
                case ApplicationStatus.AGREE:
                    statistics.agree = count;
                    break;
                case ApplicationStatus.DISAGREE:
                    statistics.disagree = count;
                    break;
                case ApplicationStatus.DUBBING:
                    statistics.dubbing = count;
                    break;
            }
            statistics.total += count;
        });

        return statistics;
    }
}

export const applicationRepository = new ApplicationRepository();
