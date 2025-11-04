export const USER_ROLE = {
    ADMIN: "admin",
    MANAGER: "manager",
} as const;
export type UserRole = typeof USER_ROLE[keyof typeof USER_ROLE];
