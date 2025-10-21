import joi from "joi";

import { ApplicationStatus } from "../enums/application-status-enum";
import { Course } from "../enums/course.enum";
import { CourseFormat } from "../enums/course-format.enum";
import { CourseType } from "../enums/course-type.enum";
import { RegexEnum } from "../enums/regex.enum";

export class ApplicationValidator {
    private static email = joi.string().email().trim();

    static getAll = joi.object({
        page: joi.number().integer().min(1).default(1),
        pageSize: joi.number().integer().min(1).default(25),

        name: joi.string().trim().min(1).optional(),
        surname: joi.string().trim().min(1).optional(),
        email: this.email.optional(),
        phone: joi.string().regex(RegexEnum.PHONE).optional(),
        age: joi.number().integer().min(10).max(100).optional(),

        course: joi
            .string()
            .valid(...Object.values(Course))
            .optional(),
        course_type: joi
            .string()
            .valid(...Object.values(CourseType))
            .optional(),
        course_format: joi
            .string()
            .valid(...Object.values(CourseFormat))
            .optional(),

        status: joi
            .string()
            .valid(...Object.values(ApplicationStatus))
            .optional(),

        manager: joi.string().trim().optional(),

        sort: joi
            .string()
            .valid(
                "name",
                "surname",
                "email",
                "phone",
                "age",
                "course",
                "status",
                "manager",
                "createdAt",
            )
            .optional(),
        order: joi.string().valid("asc", "desc").optional(),
    });

    static update = joi.object({
        name: joi.string().trim().optional(),
        surname: joi.string().trim().optional(),
        email: this.email.optional(),
        phone: joi.string().regex(RegexEnum.PHONE).optional(),
        age: joi.number().integer().min(10).max(100).optional(),

        course: joi
            .string()
            .valid(...Object.values(Course))
            .optional(),
        course_type: joi
            .string()
            .valid(...Object.values(CourseType))
            .optional(),
        course_format: joi
            .string()
            .valid(...Object.values(CourseFormat))
            .optional(),

        status: joi
            .string()
            .valid(...Object.values(ApplicationStatus))
            .optional(),

        manager: joi.string().optional(),
    });

    static addComment = joi.object({
        comment: joi.string().trim().min(1).max(1000).required(),
    });
}

export const applicationValidator = new ApplicationValidator();
