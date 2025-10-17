import { IComment, ICommentCreate } from "../interfaces/comment.interface";
import { Comment } from "../models/comment.model";

class CommentRepository {
    public create(data: ICommentCreate): Promise<IComment> {
        return Comment.create(data);
    }
}

export const commentRepository = new CommentRepository();
