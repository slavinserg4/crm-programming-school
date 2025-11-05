import { IBaseModel } from "./IBaseModel";
import { UserRole } from "../enums/UserRoleEnum";

export interface IUser extends IBaseModel {
    _id: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    isActive: boolean;
    isBanned: boolean;
    managerId?: string[];
    applications?: string[];
}
export type IManagerCreate = Pick<IUser, "email" | "firstName" | "lastName">;
