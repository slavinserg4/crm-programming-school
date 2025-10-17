import { IBase } from "./base.interface";

export interface IComment extends IBase {
    _id: number;
    applicationId: number;
    text: string;
    author: string;
}
export interface ICommentCreate {
    applicationId: string;
    text: string;
    author: string;
}
