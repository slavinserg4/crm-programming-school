export const COURSE_FORMAT = {
    STATIC: "static",
    ONLINE: "online",
} as const;
export type CourseFormat = typeof COURSE_FORMAT[keyof typeof COURSE_FORMAT]; 