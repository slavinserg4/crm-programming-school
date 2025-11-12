export interface IOrderComment {
    text: string;
    createdAt: string;
    author: IAuthor;
}
export interface IAuthor {
  _id: string;
  createdAt: string;
  email: string;
  firstName: string;
}