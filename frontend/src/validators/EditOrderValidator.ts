import Joi from "joi";
import { APPLICATION_STATUS } from "../enums/ApplicationStatusEnum";
import { COURSE_FORMAT } from "../enums/CourseFormatStatus";
import { COURSE_TYPE } from "../enums/CourseTypeEnum";
import { COURSE } from "../enums/CourseEnum";



export const applicationUpdateSchema = Joi.object({
    name: Joi.string().trim().min(2).max(50).optional().messages({
        "string.empty": "Name is required",
        "string.min": "Name must be at least 2 characters long",
    }),
    surname: Joi.string().trim().min(2).max(50).optional().messages({
        "string.empty": "Surname is required",
        "string.min": "Surname must be at least 2 characters long",
    }),
    email: Joi.string().email({ tlds: false }).optional().messages({
        "string.email": "Invalid email format",
        "string.empty": "Email is required",
    }),
    phone: Joi.string()
        .pattern(/^380\d{9}$/)
        .optional()
        .messages({
            "string.pattern.base": "Phone must be in format 380XXXXXXXXX",
            "string.empty": "Phone is required",
        }),
    age: Joi.number().integer().min(1).max(100).optional().messages({
        "number.base": "Age must be a number",
        "number.min": "Too young",
        "number.max": "Too old",
    }),
    course: Joi.string()
        .valid(...Object.values(COURSE))
        .required()
        .messages({
            "any.only": "Неправильне значення курсу",
        }),

    course_type: Joi.string()
        .valid(...Object.values(COURSE_TYPE))
        .required()
        .messages({
            "any.only": "Неправильний тип курсу",
        }),

    course_format: Joi.string()
        .valid(...Object.values(COURSE_FORMAT))
        .required()
        .messages({
            "any.only": "Неправильний формат курсу",
        }),

    status: Joi.string()
        .valid(...Object.values(APPLICATION_STATUS))
        .required()
        .messages({
            "any.only": "Неправильний статус заявки",
        }),
    group: Joi.string().allow("").max(50),
    already_paid: Joi.number().min(0).messages({
        "number.base": "Already Paid must be a number",
    }),
    sum: Joi.number().min(0).messages({
        "number.base": "Sum must be a number",
    }),
});

