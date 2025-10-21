import joi from "joi";

import { RegexEnum } from "../enums/regex.enum";

export class ManagerValidator {
    private static email = joi.string().email().trim();
    private static password = joi.string().regex(RegexEnum.PASSWORD);
    private static firstName = joi.string().regex(RegexEnum.NAME);
    private static lastName = joi.string().regex(RegexEnum.NAME);

    public static create = joi.object({
        email: this.email.required(),
        firstName: this.firstName.required(),
        lastName: this.lastName.required(),
    });
    public static paginationSchema = joi.object({
        page: joi.number().min(1).required(),
        pageSize: joi.number().min(1).required(),
    });
    public static activateAndRecovery = joi.object({
        firstPassword: this.password.required(),
        secondPassword: joi.required(),
    });
}
