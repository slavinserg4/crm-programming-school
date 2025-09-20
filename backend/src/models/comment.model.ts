import { model, Schema } from "mongoose";

import { IComment } from "../interfaces/comment.interface";

const commentSchema = new Schema(
    {
        applicationId: { type: Schema.Types.ObjectId, ref: "Application" },
        text: { type: String, required: true },
        author: { type: String, required: true },
    },
    {
        versionKey: false,
        timestamps: true,
    },
);
export const Comment = model<IComment>("Comment", commentSchema);
