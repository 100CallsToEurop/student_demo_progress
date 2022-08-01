import {Query} from "./query.type";
import {Pagination} from "./pagination.types";
import {ObjectId} from "mongodb";

export type PostInputModel  = {
    title: string,
    shortDescription: string,
    content: string,
    bloggerId: string,
}

export type PostViewModel = PostInputModel & {
    id: string,
    bloggerName: string
}

export type PostModel = {
    _id: ObjectId
    title: string,
    shortDescription: string,
    content: string,
    bloggerId: string,
    bloggerName: string
}

export type PostQuery = Query & {
    id?: string,
}

export type PaginationPosts = Pagination & {
    items?: Array<PostViewModel>
}

