export interface IManagerStats {
    total: number;
    inWork: number;
    new: number;
    agree: number;
    disagree: number;
    dubbing: number;
}
export interface IManagerQuery {
    pageSize: number;
    page: number;
}