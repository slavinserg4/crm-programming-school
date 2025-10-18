import { IApplication } from "./application.interface";
import { IBase } from "./base.interface";

export interface IComment extends IBase {
    _id: string;
    applicationId: IApplication | string;
    text: string;
    author: string;
}
export interface ICommentCreate {
    applicationId: string;
    text: string;
    author: string;
}
