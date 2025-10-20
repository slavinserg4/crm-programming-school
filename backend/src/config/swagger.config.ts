import { OpenAPIV3 } from "openapi-types";
import swaggerUI from "swagger-ui-express";

/**
 * Повний swagger.config.ts для твого проєкту
 * - документує усі контролери: auth, manager, applications
 * - включає усі enum-и, інтерфейси/моделі, приклади відповідей
 * - українські описи
 */

const swaggerConfig: OpenAPIV3.Document = {
    openapi: "3.0.0",
    info: {
        title: "CRM Programming School API",
        version: "1.0.0",
        description: "Повна API-документація для CRM системи програмування",
    },
    servers: [
        {
            url: "http://localhost:5333",
            description: "Local Development",
        },
    ],
    tags: [
        { name: "Auth", description: "Авторизація та токени" },
        {
            name: "Manager",
            description: "Керування менеджерами та їх активація/бан",
        },
        {
            name: "Applications",
            description: "Робота із заявками: фільтрація, оновлення, коментарі",
        },
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: "http",
                scheme: "bearer",
                bearerFormat: "JWT",
            },
        },

        // Загальні reusable responses
        responses: {
            UnauthorizedError: {
                description: "Не авторизований",
                content: {
                    "application/json": {
                        schema: { $ref: "#/components/schemas/Error" },
                        examples: {
                            example: {
                                value: {
                                    message: "No token provided",
                                    status: 401,
                                },
                            },
                        },
                    },
                },
            },
            ForbiddenError: {
                description: "Доступ заборонено",
                content: {
                    "application/json": {
                        schema: { $ref: "#/components/schemas/Error" },
                        examples: {
                            example: {
                                value: {
                                    message: "You don’t have permission",
                                    status: 403,
                                },
                            },
                        },
                    },
                },
            },
            NotFoundError: {
                description: "Ресурс не знайдено",
                content: {
                    "application/json": {
                        schema: { $ref: "#/components/schemas/Error" },
                        examples: {
                            example: {
                                value: {
                                    message: "Resource not found",
                                    status: 404,
                                },
                            },
                        },
                    },
                },
            },
            BadRequestError: {
                description: "Помилка запиту",
                content: {
                    "application/json": {
                        schema: { $ref: "#/components/schemas/Error" },
                        examples: {
                            example: {
                                value: { message: "Invalid data", status: 400 },
                            },
                        },
                    },
                },
            },
            InternalServerError: {
                description: "Внутрішня помилка сервера",
                content: {
                    "application/json": {
                        schema: { $ref: "#/components/schemas/Error" },
                        examples: {
                            example: {
                                value: {
                                    message: "Internal server error",
                                    status: 500,
                                },
                            },
                        },
                    },
                },
            },
        },

        schemas: {
            // ENUMS
            ActionTokenTypeEnum: {
                type: "string",
                description: "Тип action-token'у",
                enum: ["activate", "recovery"],
                example: "activate",
            },
            ApplicationStatus: {
                type: "string",
                description: "Статус заявки",
                enum: ["In work", "New", "Aggre", "Disaggre", "Dubbing"],
                example: "New",
            },
            Course: {
                type: "string",
                enum: ["FS", "QACX", "JCX", "JSCX", "FE", "PCX"],
                example: "FS",
            },
            CourseFormat: {
                type: "string",
                enum: ["static", "online"],
                example: "online",
            },
            CourseType: {
                type: "string",
                enum: ["pro", "minimal", "premium", "incubator", "vip"],
                example: "pro",
            },
            EmailEnum: {
                type: "string",
                enum: ["ACTIVATE", "RECOVERY"],
                example: "ACTIVATE",
            },
            StatusCodesEnum: {
                type: "integer",
                enum: [200, 201, 204, 400, 401, 403, 404],
                example: 200,
            },
            TokenTypeEnum: {
                type: "string",
                enum: ["accessToken", "refreshToken"],
                example: "accessToken",
            },
            UserRoleEnum: {
                type: "string",
                enum: ["admin", "manager"],
                example: "manager",
            },

            // BASE / PRIMITIVE SCHEMAS
            Error: {
                type: "object",
                properties: {
                    message: { type: "string" },
                    status: { type: "integer" },
                },
                example: { message: "Invalid token", status: 401 },
            },

            // AUTH SCHEMAS
            Login: {
                type: "object",
                required: ["email", "password"],
                properties: {
                    email: {
                        type: "string",
                        format: "email",
                        example: "admin@example.com",
                    },
                    password: { type: "string", example: "password123" },
                },
                example: {
                    email: "admin@example.com",
                    password: "password123",
                },
            },
            TokenPair: {
                type: "object",
                properties: {
                    accessToken: { type: "string", example: "eyJhbGci..." },
                    refreshToken: { type: "string", example: "eyJhbGci..." },
                },
                example: {
                    accessToken: "eyJhbGciACCESS...",
                    refreshToken: "eyJhbGciREFRESH...",
                },
            },
            SignInResponse: {
                type: "object",
                properties: {
                    user: { $ref: "#/components/schemas/User" },
                    tokens: { $ref: "#/components/schemas/TokenPair" },
                },
                example: {
                    user: {
                        _id: "64a1f2c0b3d2f0a1a1a1a1a1",
                        email: "admin@example.com",
                        firstName: "Admin",
                        lastName: "User",
                        role: "admin",
                        isActive: true,
                        isBanned: false,
                        managerId: [],
                        applications: [],
                        createdAt: "2025-01-01T12:00:00.000Z",
                        updatedAt: "2025-01-01T12:00:00.000Z",
                    },
                    tokens: {
                        accessToken: "eyJhbGciACCESS...",
                        refreshToken: "eyJhbGciREFRESH...",
                    },
                },
            },

            // USER / MANAGER SCHEMAS
            User: {
                type: "object",
                properties: {
                    _id: {
                        type: "string",
                        example: "64a1f2c0b3d2f0a1a1a1a1a1",
                    },
                    email: {
                        type: "string",
                        format: "email",
                        example: "manager@example.com",
                    },
                    firstName: { type: "string", example: "Olga" },
                    lastName: { type: "string", example: "Ivanova" },
                    role: { $ref: "#/components/schemas/UserRoleEnum" },
                    isActive: { type: "boolean", example: true },
                    isBanned: { type: "boolean", example: false },
                    managerId: {
                        type: "array",
                        items: { type: "string" },
                        example: [],
                    },
                    applications: {
                        type: "array",
                        items: { type: "string" },
                        example: ["64b1f2c0b3d2f0a1a1a1b2c3"],
                    },
                    createdAt: { type: "string", format: "date-time" },
                    updatedAt: { type: "string", format: "date-time" },
                },
                required: ["_id", "email", "firstName", "lastName"],
            },
            ManagerCreate: {
                type: "object",
                required: ["email", "firstName", "lastName"],
                properties: {
                    email: { type: "string", format: "email" },
                    firstName: { type: "string" },
                    lastName: { type: "string" },
                },
                example: {
                    email: "new.manager@example.com",
                    firstName: "New",
                    lastName: "Manager",
                },
            },

            // TOKEN STORAGE MODEL
            TokenModel: {
                type: "object",
                properties: {
                    _id: { type: "string" },
                    accessToken: { type: "string" },
                    refreshToken: { type: "string" },
                    _userId: { type: "string" },
                    createdAt: { type: "string", format: "date-time" },
                    updatedAt: { type: "string", format: "date-time" },
                },
            },

            // GROUP / COMMENT
            Group: {
                type: "object",
                properties: {
                    _id: { type: "string" },
                    name: { type: "string", example: "Group A" },
                    createdAt: { type: "string", format: "date-time" },
                    updatedAt: { type: "string", format: "date-time" },
                },
            },
            Comment: {
                type: "object",
                properties: {
                    _id: { type: "string" },
                    applicationId: { type: "string" },
                    text: { type: "string", example: "Коментар менеджера" },
                    author: { type: "string", example: "64a1f..." },
                    createdAt: { type: "string", format: "date-time" },
                    updatedAt: { type: "string", format: "date-time" },
                },
                required: ["text"],
            },
            CommentCreate: {
                type: "object",
                required: ["text"],
                properties: { text: { type: "string" } },
                example: { text: "Коментар до заявки" },
            },

            // APPLICATIONS
            Application: {
                type: "object",
                properties: {
                    _id: { type: "string" },
                    name: { type: "string", example: "Ivan" },
                    surname: { type: "string", example: "Petrov" },
                    email: {
                        type: "string",
                        format: "email",
                        example: "ivan@mail.com",
                    },
                    phone: { type: "string", example: "+380501234567" },
                    age: { type: "number", example: 25 },
                    course: { $ref: "#/components/schemas/Course" },
                    course_type: { $ref: "#/components/schemas/CourseType" },
                    course_format: {
                        $ref: "#/components/schemas/CourseFormat",
                    },
                    status: { $ref: "#/components/schemas/ApplicationStatus" },
                    sum: { type: "number", nullable: true, example: 1000 },
                    already_paid: {
                        type: "number",
                        nullable: true,
                        example: 200,
                    },
                    group: {
                        $ref: "#/components/schemas/Group",
                        nullable: true,
                    },
                    manager: {
                        $ref: "#/components/schemas/User",
                        nullable: true,
                    },
                    comments: {
                        type: "array",
                        items: { $ref: "#/components/schemas/Comment" },
                    },
                    utm: { type: "string", example: "fb_campaign" },
                    msg: { type: "string", nullable: true },
                    createdAt: { type: "string", format: "date-time" },
                    updatedAt: { type: "string", format: "date-time" },
                },
            },
            ApplicationUpdate: {
                type: "object",
                properties: {
                    name: { type: "string" },
                    surname: { type: "string" },
                    email: { type: "string", format: "email" },
                    phone: { type: "string" },
                    age: { type: "number" },
                    status: { $ref: "#/components/schemas/ApplicationStatus" },
                    group: { type: "string" },
                    sum: { type: "number" },
                    already_paid: { type: "number" },
                    course: { $ref: "#/components/schemas/Course" },
                    course_type: { $ref: "#/components/schemas/CourseType" },
                    course_format: {
                        $ref: "#/components/schemas/CourseFormat",
                    },
                },
                example: {
                    status: "In work",
                    sum: 1000,
                    already_paid: 200,
                    group: null,
                },
            },

            // PAGINATED RESPONSES
            PaginatedApplications: {
                type: "object",
                properties: {
                    totalItems: { type: "number", example: 100 },
                    totalPages: { type: "number", example: 4 },
                    prevPage: { type: "boolean", example: false },
                    nextPage: { type: "boolean", example: true },
                    data: {
                        type: "array",
                        items: { $ref: "#/components/schemas/Application" },
                    },
                },
            },
            PaginatedManagers: {
                type: "object",
                properties: {
                    totalItems: { type: "number" },
                    totalPages: { type: "number" },
                    prevPage: { type: "boolean" },
                    nextPage: { type: "boolean" },
                    data: {
                        type: "array",
                        items: { $ref: "#/components/schemas/User" },
                    },
                },
            },

            // QUERIES (плюс приклади для параметрів)
            ApplicationQuery: {
                type: "object",
                properties: {
                    page: { type: "number", example: 1 },
                    pageSize: { type: "number", example: 25 },
                    sort: { type: "string", example: "createdAt" },
                    order: {
                        type: "string",
                        enum: ["asc", "desc"],
                        example: "desc",
                    },
                    name: { type: "string" },
                    surname: { type: "string" },
                    email: { type: "string" },
                    phone: { type: "string" },
                    age: { type: "number" },
                    course: { $ref: "#/components/schemas/Course" },
                    course_type: { $ref: "#/components/schemas/CourseType" },
                    course_format: {
                        $ref: "#/components/schemas/CourseFormat",
                    },
                    status: { $ref: "#/components/schemas/ApplicationStatus" },
                    group: { type: "string" },
                    manager: { type: "string" },
                    startDate: { type: "string", format: "date" },
                    endDate: { type: "string", format: "date" },
                },
            },
        }, // end schemas
    },

    // PATHS: детально описані ендпоінти з відповідями та прикладами
    paths: {
        /**
         * AUTH
         */
        "/auth/sign-in": {
            post: {
                tags: ["Auth"],
                summary: "Авторизація користувача",
                description:
                    "Вхід користувача по email та password. Повертає user + tokens.",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/Login" },
                        },
                    },
                },
                responses: {
                    200: {
                        description:
                            "Успішна авторизація (повертає user та токени)",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/SignInResponse",
                                },
                                examples: {
                                    success: {
                                        value: {
                                            user: {
                                                _id: "64a1f2c0b3d2f0a1a1a1a1a1",
                                                email: "admin@example.com",
                                                firstName: "Admin",
                                                lastName: "User",
                                                role: "admin",
                                                isActive: true,
                                                isBanned: false,
                                                managerId: [],
                                                applications: [],
                                                createdAt:
                                                    "2025-01-01T12:00:00.000Z",
                                                updatedAt:
                                                    "2025-01-01T12:00:00.000Z",
                                            },
                                            tokens: {
                                                accessToken:
                                                    "eyJhbGciACCESS...",
                                                refreshToken:
                                                    "eyJhbGciREFRESH...",
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    401: { $ref: "#/components/responses/UnauthorizedError" },
                    403: { $ref: "#/components/responses/ForbiddenError" },
                    500: { $ref: "#/components/responses/InternalServerError" },
                },
            },
        },

        "/auth/refresh": {
            post: {
                tags: ["Auth"],
                summary: "Оновлення токенів доступу",
                description:
                    "Оновлює пару токенів за допомогою refreshToken. Повертає нові токени.",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                required: ["refreshToken"],
                                properties: {
                                    refreshToken: { type: "string" },
                                },
                                example: { refreshToken: "eyJhbGciREFRESH..." },
                            },
                        },
                    },
                },
                responses: {
                    200: {
                        description: "Нові токени",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        tokens: {
                                            $ref: "#/components/schemas/TokenPair",
                                        },
                                    },
                                },
                                examples: {
                                    ok: {
                                        value: {
                                            tokens: {
                                                accessToken: "newAcc...",
                                                refreshToken: "newRef...",
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    403: { $ref: "#/components/responses/ForbiddenError" },
                    401: { $ref: "#/components/responses/UnauthorizedError" },
                    500: { $ref: "#/components/responses/InternalServerError" },
                },
            },
        },

        "/auth/me": {
            get: {
                tags: ["Auth"],
                summary: "Отримати інформацію про поточного користувача",
                security: [{ bearerAuth: [] }],
                responses: {
                    200: {
                        description: "Інформація про користувача",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/User" },
                                examples: {
                                    example: {
                                        value: {
                                            _id: "64a1f...",
                                            email: "u@ex.com",
                                            firstName: "Olga",
                                            lastName: "Iva",
                                            role: "manager",
                                            isActive: true,
                                            isBanned: false,
                                        },
                                    },
                                },
                            },
                        },
                    },
                    401: { $ref: "#/components/responses/UnauthorizedError" },
                    500: { $ref: "#/components/responses/InternalServerError" },
                },
            },
        },

        /**
         * MANAGER (routes from manager.router)
         */
        "/manager/create": {
            post: {
                tags: ["Manager"],
                summary: "Створити нового менеджера (Admin only)",
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/ManagerCreate",
                            },
                        },
                    },
                },
                responses: {
                    201: {
                        description: "Менеджер створений",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/User" },
                                examples: {
                                    created: {
                                        value: {
                                            _id: "64a2...",
                                            email: "new.manager@example.com",
                                            firstName: "New",
                                            lastName: "Manager",
                                            role: "manager",
                                            isActive: false,
                                        },
                                    },
                                },
                            },
                        },
                    },
                    400: { $ref: "#/components/responses/BadRequestError" },
                    401: { $ref: "#/components/responses/UnauthorizedError" },
                    403: { $ref: "#/components/responses/ForbiddenError" },
                    500: { $ref: "#/components/responses/InternalServerError" },
                },
            },
        },

        // managersByAdmin -> route: GET /manager/admins (in code was "/admins" but router mounting is "/manager" + "/admins")
        "/manager/admins": {
            get: {
                tags: ["Manager"],
                summary:
                    "Отримати список менеджерів адміністратора (Admin only)",
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: "page",
                        in: "query",
                        schema: { type: "number", default: 1 },
                    },
                    {
                        name: "pageSize",
                        in: "query",
                        schema: { type: "number", default: 25 },
                    },
                ],
                responses: {
                    200: {
                        description: "Повертає пагінований список менеджерів",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/PaginatedManagers",
                                },
                            },
                        },
                    },
                    401: { $ref: "#/components/responses/UnauthorizedError" },
                    403: { $ref: "#/components/responses/ForbiddenError" },
                },
            },
        },

        "/manager/activate-request/{id}": {
            post: {
                tags: ["Manager"],
                summary: "Запит на активацію менеджера (відправка email)",
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        required: true,
                        schema: { type: "string" },
                    },
                ],
                responses: {
                    200: {
                        description: "Відправлено посилання для активації",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        message: { type: "string" },
                                        url: {
                                            type: "string",
                                            example:
                                                "https://frontend/activate/eyJhb...",
                                        },
                                    },
                                },
                                example: {
                                    message:
                                        "Check manager's email or give him a link",
                                    url: "https://frontend/activate/eyJhb...",
                                },
                            },
                        },
                    },
                    404: { $ref: "#/components/responses/NotFoundError" },
                    401: { $ref: "#/components/responses/UnauthorizedError" },
                    403: { $ref: "#/components/responses/ForbiddenError" },
                },
            },
        },

        "/manager/activate/{token}": {
            patch: {
                tags: ["Manager"],
                summary: "Активація менеджера за токеном (PATCH)",
                parameters: [
                    {
                        name: "token",
                        in: "path",
                        required: true,
                        schema: { type: "string" },
                    },
                ],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/PasswordReset",
                            },
                        },
                    },
                },
                responses: {
                    200: {
                        description:
                            "Менеджера активовано та повертається об'єкт користувача",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/User" },
                            },
                        },
                    },
                    400: { $ref: "#/components/responses/BadRequestError" },
                    401: { $ref: "#/components/responses/UnauthorizedError" },
                    404: { $ref: "#/components/responses/NotFoundError" },
                },
            },
        },

        "/manager/recovery-request/{id}": {
            post: {
                tags: ["Manager"],
                summary: "Запит на відновлення паролю (відправка email)",
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        required: true,
                        schema: { type: "string" },
                    },
                ],
                responses: {
                    200: {
                        description:
                            "Посилання для відновлення паролю надіслано",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        message: { type: "string" },
                                        url: { type: "string" },
                                    },
                                },
                            },
                        },
                    },
                    404: { $ref: "#/components/responses/NotFoundError" },
                    401: { $ref: "#/components/responses/UnauthorizedError" },
                    403: { $ref: "#/components/responses/ForbiddenError" },
                },
            },
        },

        "/manager/recovery/{token}": {
            post: {
                tags: ["Manager"],
                summary: "Відновлення паролю за токеном",
                parameters: [
                    {
                        name: "token",
                        in: "path",
                        required: true,
                        schema: { type: "string" },
                    },
                ],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/PasswordReset",
                            },
                        },
                    },
                },
                responses: {
                    200: {
                        description: "Пароль змінено, повертається користувач",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/User" },
                            },
                        },
                    },
                    400: { $ref: "#/components/responses/BadRequestError" },
                    401: { $ref: "#/components/responses/UnauthorizedError" },
                    404: { $ref: "#/components/responses/NotFoundError" },
                },
            },
        },

        "/manager/ban/{id}": {
            patch: {
                tags: ["Manager"],
                summary: "Забанити менеджера (Admin only)",
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        required: true,
                        schema: { type: "string" },
                    },
                ],
                responses: {
                    200: {
                        description: "Менеджер заблокований",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        "Manager banned": { type: "string" },
                                    },
                                },
                                example: { "Manager banned": "true" },
                            },
                        },
                    },
                    404: { $ref: "#/components/responses/NotFoundError" },
                    401: { $ref: "#/components/responses/UnauthorizedError" },
                    403: { $ref: "#/components/responses/ForbiddenError" },
                },
            },
        },

        "/manager/unban/{id}": {
            patch: {
                tags: ["Manager"],
                summary: "Розбанити менеджера (Admin only)",
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        required: true,
                        schema: { type: "string" },
                    },
                ],
                responses: {
                    200: {
                        description: "Менеджер розблокований",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        "Manager unbanned": { type: "string" },
                                    },
                                },
                                example: { "Manager unbanned": "true" },
                            },
                        },
                    },
                    404: { $ref: "#/components/responses/NotFoundError" },
                    401: { $ref: "#/components/responses/UnauthorizedError" },
                    403: { $ref: "#/components/responses/ForbiddenError" },
                },
            },
        },

        /**
         * APPLICATIONS (routes from application.router)
         */
        "/applications": {
            get: {
                tags: ["Applications"],
                summary:
                    "Отримати список заявок (фільтрація доступна через query params)",
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: "page",
                        in: "query",
                        schema: { type: "number", default: 1 },
                    },
                    {
                        name: "pageSize",
                        in: "query",
                        schema: { type: "number", default: 25 },
                    },
                    {
                        name: "sort",
                        in: "query",
                        schema: { type: "string", example: "createdAt" },
                    },
                    {
                        name: "order",
                        in: "query",
                        schema: {
                            type: "string",
                            enum: ["asc", "desc"],
                            example: "desc",
                        },
                    },
                    { name: "name", in: "query", schema: { type: "string" } },
                    {
                        name: "surname",
                        in: "query",
                        schema: { type: "string" },
                    },
                    { name: "email", in: "query", schema: { type: "string" } },
                    { name: "phone", in: "query", schema: { type: "string" } },
                    {
                        name: "course",
                        in: "query",
                        schema: { $ref: "#/components/schemas/Course" },
                    },
                    {
                        name: "status",
                        in: "query",
                        schema: {
                            $ref: "#/components/schemas/ApplicationStatus",
                        },
                    },
                    {
                        name: "startDate",
                        in: "query",
                        schema: { type: "string", format: "date" },
                    },
                    {
                        name: "endDate",
                        in: "query",
                        schema: { type: "string", format: "date" },
                    },
                ],
                responses: {
                    200: {
                        description: "Повертає пагінований список заявок",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/PaginatedApplications",
                                },
                            },
                        },
                    },
                    401: { $ref: "#/components/responses/UnauthorizedError" },
                    500: { $ref: "#/components/responses/InternalServerError" },
                },
            },
        },

        "/applications/{id}": {
            get: {
                tags: ["Applications"],
                summary: "Отримати заявку по ID",
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        required: true,
                        schema: { type: "string" },
                    },
                ],
                responses: {
                    200: {
                        description: "Заявка",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/Application",
                                },
                            },
                        },
                    },
                    404: { $ref: "#/components/responses/NotFoundError" },
                    401: { $ref: "#/components/responses/UnauthorizedError" },
                },
            },
        },

        "/applications/update/{id}": {
            patch: {
                tags: ["Applications"],
                summary: "Оновити заявку (PATCH)",
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        required: true,
                        schema: { type: "string" },
                    },
                ],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/ApplicationUpdate",
                            },
                        },
                    },
                },
                responses: {
                    200: {
                        description: "Оновлена заявка",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/Application",
                                },
                            },
                        },
                    },
                    400: { $ref: "#/components/responses/BadRequestError" },
                    403: { $ref: "#/components/responses/ForbiddenError" },
                    404: { $ref: "#/components/responses/NotFoundError" },
                },
            },
        },

        "/applications/addcomm/{id}": {
            patch: {
                tags: ["Applications"],
                summary: "Додати коментар до заявки",
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        required: true,
                        schema: { type: "string" },
                    },
                ],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/CommentCreate",
                            },
                        },
                    },
                },
                responses: {
                    200: {
                        description:
                            "Повертається оновлена заявка з доданим коментарем",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/Application",
                                },
                            },
                        },
                    },
                    400: { $ref: "#/components/responses/BadRequestError" },
                    403: { $ref: "#/components/responses/ForbiddenError" },
                    404: { $ref: "#/components/responses/NotFoundError" },
                },
            },
        },
    }, // end paths
};

export { swaggerConfig, swaggerUI };
