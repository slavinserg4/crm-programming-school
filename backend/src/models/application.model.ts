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
        course: { type: String, required: true, enum: Course },
        course_type: { type: String, required: true, enum: CourseType },
        course_format: { type: String, required: true, enum: CourseFormat },
        status: { type: String, required: true, enum: ApplicationStatus },
        sum: { type: Number },
        already_paid: { type: Number, required: true },
        group: { type: String },
        manager: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        utm: { type: String, required: true },
        msg: { type: String },
        comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
    },
    {
        versionKey: false,
        timestamps: true,
    },
);
export const Application = model<IApplication>(
    "Application",
    applicationSchema,
);
