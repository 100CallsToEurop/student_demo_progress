import mongoose from "mongoose";
import {ObjectId} from "mongodb";

export interface IPost{
    _id: ObjectId
    title: string,
    shortDescription: string,
    content: string,
    bloggerId: string,
    bloggerName: string
}

const postSchema = new mongoose.Schema<IPost>({
    //id: { type: mongoose.Schema.Types.ObjectId, required: false },
    title: { type: String, required: true },
    shortDescription: { type: String, required: true },
    content: { type: String, required: true },
    bloggerId: { type: String, required: true },
    bloggerName: { type: String, required: true },
});

export const PostsModel = mongoose.model<IPost>('posts', postSchema)