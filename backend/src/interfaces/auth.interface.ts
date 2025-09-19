import { ITokenResponse } from "./token.interface";
import { IUser } from "./user.interface";

export interface ILogin {
    email: string;
    password: string;
}
export type ILoginResponse = {
    token: ITokenResponse;
    user: Pick<IUser, "_id" | "email" | "firstName" | "lastName" | "role">;
};
