import { model, Schema } from "mongoose";

import { UserRoleEnum } from "../enums/user.role.enum";
import { IUser } from "../interfaces/user.interface";

const userSchema = new Schema(
    {
        email: { type: String, required: true },
        password: { type: String, required: true },
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        role: {
            enum: UserRoleEnum,
            type: String,
            required: true,
            default: UserRoleEnum.MANAGER,
        },
    },
    {
        versionKey: false,
        timestamps: true,
        toJSON: {
            transform: (doc, ret) => {
                delete ret.password;
                return ret;
            },
        },
    },
);
export const User = model<IUser>("User", userSchema);
