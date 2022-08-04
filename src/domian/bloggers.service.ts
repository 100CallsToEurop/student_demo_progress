import "reflect-metadata"
import {
    BloggerInputModel,
    BloggerQuery,
    BloggerViewModel,
    PaginationBloggers
} from "../types/blogger.type";
import {ObjectId} from "mongodb";
import {IBlogger} from "../models/blogger.model";
import {injectable} from "inversify";
import {BloggersRepository} from "../repositories/bloggers-repository-db";

@injectable()
export class BloggersService{
    constructor(
        private bloggersRepository: BloggersRepository
    ) {}

    async getBloggers(queryParams?: BloggerQuery): Promise<PaginationBloggers> {
        return await this.bloggersRepository.getBloggers(queryParams)
    }
    async getBloggerById(id: ObjectId): Promise<BloggerViewModel | null> {
        const blogger = await this.bloggersRepository.getBloggerById(id)
        if(!blogger) return null
        return {
            id: blogger._id.toString(),
            name: blogger.name,
            youtubeUrl: blogger.youtubeUrl
        }
    }
    async deleteBloggerById(id: ObjectId): Promise<boolean> {
        return await this.bloggersRepository.deleteBloggerById(id)
    }
    async updateBloggerById(id: ObjectId, updateParam: BloggerInputModel): Promise<boolean> {
        return await this.bloggersRepository.updateBloggerById(id, updateParam)
    }
    async createBlogger(createParam: BloggerInputModel): Promise<BloggerViewModel>{
        const newBlogger: IBlogger = {
            ...createParam,
            _id: new ObjectId()
        }
        await this.bloggersRepository.createBlogger(newBlogger)
        return {
            id: newBlogger._id.toString(),
            name: newBlogger.name,
            youtubeUrl: newBlogger.youtubeUrl
        }
    }
}
