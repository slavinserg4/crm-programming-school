import { model, Schema } from "mongoose";

import { ApplicationStatus } from "../enums/application-status-enum";
import { Course } from "../enums/course.enum";
import { CourseFormat } from "../enums/course-format.enum";
import { CourseType } from "../enums/course-type.enum";
import { IApplication } from "../interfaces/application.interface";

const applicationSchema = new Schema(
    {
        name: { type: String, required: true },
        surname: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true },
        age: { type: Number, required: true },
        course: { type: String, required: true, enum: Object.values(Course) },
        course_type: {
            type: String,
            required: true,
            enum: Object.values(CourseType),
        },
        course_format: {
            type: String,
            required: true,
            enum: Object.values(CourseFormat),
        },
        status: {
            type: String,
            required: true,
            enum: Object.values(ApplicationStatus),
        },
        sum: { type: Number, default: null },
        already_paid: { type: Number, default: null },

        group: { type: Schema.Types.ObjectId, ref: "Group", default: null },
        manager: {
            type: Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
        comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],

        utm: { type: String },
        msg: { type: String, default: null },
    },
    {
        versionKey: false,
        timestamps: true,
    },
);

export const Application = model<IApplication>(
    "Application",
    applicationSchema,
    "application",
);
