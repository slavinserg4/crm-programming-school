import { ApplicationStatus } from "../enums/application-status-enum";
import { Course } from "../enums/course.enum";
import { CourseFormat } from "../enums/course-format.enum";
import { CourseType } from "../enums/course-type.enum";
import { IBase } from "./base.interface";
import { IComment } from "./comment.interface";

export interface IApplication extends IBase {
    _id?: number;
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
    group?: string | null;
    manager?: string | null;
    utm: string;
    msg: string | null;
    comments?: IComment[];
}
