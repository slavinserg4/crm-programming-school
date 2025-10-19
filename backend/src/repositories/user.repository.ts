import { FilterQuery } from "mongoose";

import { IManagerQuery } from "../interfaces/manager.interface";
import { IManagerCreate, IUser } from "../interfaces/user.interface";
import { User } from "../models/user.model";

class UserRepository {
    public getByEmail(email: string): Promise<IUser> {
        return User.findOne({ email });
    }
    public async createManager(
        dto: IManagerCreate,
        adminId: string,
    ): Promise<IUser> {
        const manager = await User.create(dto);

        await User.findByIdAndUpdate(adminId, {
            $push: { managerId: manager._id },
        });

        return manager;
    }
    public getUserById(id: string): Promise<IUser> {
        return User.findById(id);
    }
    public addApplicationToUser(
        userId: string,
        applicationId: string,
    ): Promise<IUser> {
        return User.findByIdAndUpdate(
            userId,
            {
                $addToSet: { applications: applicationId },
            },
            { new: true },
        );
    }
    public async getAll(
        query: IManagerQuery,
        adminId: string,
    ): Promise<[IUser[], number]> {
        const skip = query.pageSize * (query.page - 1);

        const admin = await User.findById(adminId).select("managerId");
        if (!admin) {
            return [[], 0];
        }

        const filterObject: FilterQuery<IUser> = {
            _id: { $in: admin.managerId },
        };

        return await Promise.all([
            User.find(filterObject)
                .limit(query.pageSize)
                .skip(skip)
                .sort({ createdAt: -1 }),
            User.countDocuments(filterObject),
        ]);
    }
    public updateById(userId: string, user: Partial<IUser>): Promise<IUser> {
        return User.findByIdAndUpdate(userId, user, { new: true });
    }
}
export const userRepository = new UserRepository();
