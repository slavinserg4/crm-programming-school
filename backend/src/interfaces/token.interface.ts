import { UserRoleEnum } from "../enums/user.role.enum";
import { IBase } from "./base.interface";

export interface IToken extends IBase {
    _id: string;
    accessToken: string;
    _userId: string;
}
export type ITokenModel = Pick<IToken, "accessToken" | "_userId">;
export interface ITokenPayload {
    userId: string;
    role: UserRoleEnum;
}
export type ITokenResponse = Pick<IToken, "accessToken">;
