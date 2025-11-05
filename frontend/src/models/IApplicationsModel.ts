import { IBaseModel } from "./IBaseModel";
import { Course } from "../enums/CourseEnum";
import { CourseType } from "../enums/CourseTypeEnum";
import { CourseFormat } from "../enums/CourseFormatStatus";
import { ApplicationStatus } from "../enums/ApplicationStatusEnum";
import { IUser } from "./IUser";
import { IGroup } from "./IGroupModel";
import { IComment } from "./ICommentModel";

export interface IApplication extends IBaseModel {
    _id: string;
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

    group: IGroup | null;
    manager: IUser | null;
    comments?: IComment[] | string[];

    utm?: string;
    msg: string | null;
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

    startDate?: string;
    endDate?: string;
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
}