import { IApplication } from "./IApplicationsModel";
import { IBaseModel } from "./IBaseModel";

export interface IComment extends IBaseModel {
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