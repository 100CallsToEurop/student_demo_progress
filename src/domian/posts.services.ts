import "reflect-metadata"
import {PaginationPosts, PostInputModel, PostModel, PostQuery, PostViewModel} from "../types/post.type";
import {ObjectId} from "mongodb";
import {injectable} from "inversify";
import {PostsRepository} from "../repositories/posts-repository-db";
import {BloggersService} from "./bloggers.service";
import {IPost} from "../models/post.model";

@injectable()
export class PostsService{

    constructor(
        private postsRepository: PostsRepository,
        private bloggersService: BloggersService
    ) {}

    async getPosts(queryParams?: PostQuery): Promise<PaginationPosts | null> {
        if(queryParams?.id !== undefined) {
            const bloggers = await this.bloggersService.getBloggerById(new ObjectId(queryParams?.id))
            if (!bloggers) return null
        }
        return await this.postsRepository.getPosts(queryParams)
    }

    async getPostById(id: ObjectId): Promise<PostViewModel | null> {
        const post = await this.postsRepository.getPostById(id)
        if(!post) return null
        return {
            id: post._id.toString(),
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            bloggerId: post.bloggerId,
            bloggerName: post.bloggerName
        }
    }
    async deletePostById(id: ObjectId): Promise<boolean> {
        return await this.postsRepository.deletePostById(id)
    }
    async updatePostById(id: ObjectId, updatePost: PostInputModel): Promise<boolean | null> {
        const blogger = await this.bloggersService.getBloggerById(new ObjectId(updatePost.bloggerId))
        if (blogger) return await this.postsRepository.updatePostById(id, updatePost)
        return null

    }
    async createPost(createParam: PostInputModel):Promise<PostViewModel | null>  {

        const blogger = await this.bloggersService.getBloggerById(new ObjectId(createParam.bloggerId))
        if(!blogger) return null

        const newPost: IPost = {
            ...createParam,
            _id: new ObjectId(),
            bloggerName: blogger.name
        }
        await this.postsRepository.createPost(newPost)
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