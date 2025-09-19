import { UserRoleEnum } from "../enums/user.role.enum";
import { IBase } from "./base.interface";

export interface IUser extends IBase {
    _id: number;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: UserRoleEnum;
    isActive: boolean;
    isBanned: boolean;
}
export type IManagerCreate = Pick<
    IUser,
    "email" | "password" | "firstName" | "lastName"
>;
