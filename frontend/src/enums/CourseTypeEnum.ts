export const COURSE_TYPE = {
    PRO: "pro",
    MINIMAL: "minimal",
    PREMIUM: "premium",
    INCUBATOR: "incubator",
    VIP: "vip",
} as const;
export type CourseType = typeof COURSE_TYPE[keyof typeof COURSE_TYPE];