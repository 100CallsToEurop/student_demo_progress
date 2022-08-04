import {PostInputModel} from "./post.type";
import {Query} from "./query.type";
import {Pagination} from "./pagination.types";

export type BloggerInputModel = {
    name: string,
    youtubeUrl: string
}
export type BloggerViewModel = BloggerInputModel & {
    id: string,
}

export type BloggerPostInputModel = Omit<PostInputModel, 'bloggerId'>

export type BloggerQuery = Query & {
    SearchNameTerm?: string,
}

export type PaginationBloggers = Pagination & {
    items?: Array<BloggerViewModel>
}