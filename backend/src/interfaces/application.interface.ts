import { ApplicationStatus } from "../enums/application-status-enum";
import { Course } from "../enums/course.enum";
import { CourseFormat } from "../enums/course-format.enum";
import { CourseType } from "../enums/course-type.enum";
import { IBase } from "./base.interface";
import { IComment } from "./comment.interface";
import { IGroup } from "./group.interface";

export interface IApplication extends IBase {
    _id: number;
    name: string;
    surname: string;
    email: string;
    phone: string;
    age: number;
    course: Course;
    course_type: CourseType;
    course_format: CourseFormat;
    status: ApplicationStatus;
    sum: number | null;
    already_paid: number | null;
    group: IGroup;
    manager?: string | null;
    utm: string;
    msg: string | null;
    comments?: IComment[];
}
export interface IApplicationQuery {
    page: number;
    pageSize: number;

    sort: keyof IApplication;
    order: "asc" | "desc";

    name?: string;
    surname?: string;
    email?: string;
    phone?: string;
    age?: number;
    course?: Course;
    course_type?: CourseType;
    course_format?: CourseFormat;
    status?: ApplicationStatus;
    group?: string;
    manager?: string;

    myApplications?: boolean;
    startDate?: string;
    endDate?: string;
    minSum?: number;
    maxSum?: number;
    minPaid?: number;
    maxPaid?: number;
}
export interface IApplicationUpdate {
    name?: string;
    surname?: string;
    email?: string;
    phone?: string;
    age?: number;
    status?: ApplicationStatus;
    group?: string;
    sum?: number;
    already_paid?: number;
    course?: Course;
    course_type?: CourseType;
    course_format?: CourseFormat;
    comments?: string[];
}
