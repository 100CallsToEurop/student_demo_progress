import mongoose from "mongoose";
import {ObjectId} from "mongodb";

export interface IComment{
    _id: ObjectId
    userId: string
    content: string
    userLogin: string
    addedAt: string
    postId: string
}

const commentSchema = new mongoose.Schema<IComment>({
    //id: { type: mongoose.Schema.Types.ObjectId, required: false },
    userId: String,
    content: String,
    userLogin: String,
    addedAt: String,
    postId: String
});

export const CommentModel = mongoose.model<IComment>('comments', commentSchema)