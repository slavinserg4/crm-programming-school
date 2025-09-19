import { IBase } from "./base.interface";

export interface IComment extends IBase{
    id: number;
    applicationId: number;
    text: string;
    author: string;
}