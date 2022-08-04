import mongoose from "mongoose";
import {ObjectId} from "mongodb";

export interface IBlogger{
    _id: ObjectId
    name: string
    youtubeUrl: string
}

const bloggerSchema = new mongoose.Schema<IBlogger>({
    //id: { type: mongoose.Schema.Types.ObjectId, required: false },
    name: { type: String, required: true },
    youtubeUrl: { type: String, required: true }
});

export const BloggerModel = mongoose.model<IBlogger>('bloggers', bloggerSchema)