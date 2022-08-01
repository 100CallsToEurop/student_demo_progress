import {Query} from "./query.type";
import {Pagination} from "./pagination.types";
import {ObjectId} from "mongodb";

export type CommentInputModel = {
    content: string
}
export type CommentViewModel = CommentInputModel & {
    id: string,
    userId: string
    userLogin: string
    addedAt: string
}

export type CommentModel = {
    _id: ObjectId
    userId: string
    content: string
    userLogin: string
    addedAt: string
    postId: string
}

export type CommentQuery = Query & {
    postId?: string,
}

export type PaginationComments = Pagination & {
    items?: Array<CommentViewModel>
}