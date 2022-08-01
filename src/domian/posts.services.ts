import {postsRepository} from "../repositories/posts-repository-db";
import {bloggersService} from "./bloggers.service";
import {PaginationPosts, PostInputModel, PostModel, PostQuery, PostViewModel} from "../types/post.type";
import {ObjectId} from "mongodb";

export const postsService = {
    async getPosts(queryParams?: PostQuery): Promise<PaginationPosts | null> {
        if(queryParams?.id !== undefined) {
            const bloggers = await bloggersService.getBloggerById(new ObjectId(queryParams?.id))
            if (!bloggers) return null
        }
        return await postsRepository.getPosts(queryParams)
    },

    async getPostById(id: ObjectId): Promise<PostViewModel | null> {
        const post = await postsRepository.getPostById(id)
        if(!post) return null
        return {
            id: post._id.toString(),
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            bloggerId: post.bloggerId,
            bloggerName: post.bloggerName
        }
    },
    async deletePostById(id: ObjectId): Promise<boolean> {
        return await postsRepository.deletePostById(id)
    },
    async updatePostById(id: ObjectId, updatePost: PostInputModel): Promise<boolean | null> {
        const blogger = await bloggersService.getBloggerById(new ObjectId(updatePost.bloggerId))
        if (blogger) return await postsRepository.updatePostById(id, updatePost)
        return null

    },
    async createPost(createParam: PostInputModel):Promise<PostViewModel | null>  {

        const blogger = await bloggersService.getBloggerById(new ObjectId(createParam.bloggerId))
        if(!blogger) return null

        const newPost: PostModel = {
            ...createParam,
            _id: new ObjectId(),
            bloggerName: blogger.name
        }
        await postsRepository.createPost(newPost)
        return {
            id: newPost._id.toString(),
            title: newPost.title,
            shortDescription: newPost.shortDescription,
            content: newPost.content,
            bloggerId: newPost.bloggerId,
            bloggerName: newPost.bloggerName
        }
    }
}