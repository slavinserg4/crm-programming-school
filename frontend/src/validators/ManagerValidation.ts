import Joi from "joi";

export const managerValidator = {
    create: Joi.object({
        email: Joi.string()
            .trim()
            .email()
            .required()
            .messages({
                "string.empty": "Email є обов'язковим",
                "string.email": "Введіть коректну email адресу",
                "any.required": "Email є обов'язковим",
            }),
        firstName: Joi.string()
            .trim()
            .min(2)
            .max(20)
            .required()
            .messages({
                "string.empty": "Ім'я є обов'язковим",
                "string.min": "Ім'я повинно містити мінімум 2 символи",
                "string.max": "Ім'я не повинно перевищувати 20 символів",
                "any.required": "Ім'я є обов'язковим",
            }),
        lastName: Joi.string()
            .trim()
            .min(2)
            .max(20)
            .required()
            .messages({
                "string.empty": "Прізвище є обов'язковим",
                "string.min": "Прізвище повинно містити мінімум 2 символи",
                "string.max": "Прізвище не повинно перевищувати 20 символів",
                "any.required": "Прізвище є обов'язковим",
            }),
    }),

    passwords: Joi.object({
        firstPassword: Joi.string()
            .trim()
            .min(8)
            .required()
            .messages({
                "string.empty": "Пароль є обов'язковим",
                "string.min": "Пароль повинен містити мінімум 8 символів",
                "any.required": "Пароль є обов'язковим",
            }),
        secondPassword: Joi.string()
            .trim()
            .valid(Joi.ref('firstPassword'))
            .required()
            .messages({
                "string.empty": "Підтвердження паролю є обов'язковим",
                "any.only": "Паролі повинні співпадати",
                "any.required": "Підтвердження паролю є обов'язковим",
            }),
    }),
};