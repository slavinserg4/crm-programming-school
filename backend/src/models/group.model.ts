import { model, Schema } from "mongoose";

import { IGroup } from "../interfaces/group.interface";

const groupSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
        },
    },
    {
        versionKey: false,
        timestamps: true,
    },
);

export const Group = model<IGroup>("Group", groupSchema);
