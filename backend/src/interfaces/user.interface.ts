import { UserRoleEnum } from "../enums/user.role.enum";
import { IBase } from "./base.interface";

export interface IUser extends IBase {
    _id: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: UserRoleEnum;
    isActive: boolean;
    isBanned: boolean;
    managerId?: string[];
    applications?: string[];
}
export type IManagerCreate = Pick<IUser, "email" | "firstName" | "lastName">;
