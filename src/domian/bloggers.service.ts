

import {bloggersRepository} from "../repositories/bloggers-repository-db";
import {
    BloggerInputModel,
    BloggerModel,
    BloggerQuery,
    BloggerViewModel,
    PaginationBloggers
} from "../types/blogger.type";
import {ObjectId} from "mongodb";

export const bloggersService= {
    async getBloggers(queryParams?: BloggerQuery): Promise<PaginationBloggers> {
        return bloggersRepository.getBloggers(queryParams)
    },
    async getBloggerById(id: ObjectId): Promise<BloggerViewModel | null> {
        const blogger = await bloggersRepository.getBloggerById(id)
        if(!blogger) return null
        return {
            id: blogger._id.toString(),
            name: blogger.name,
            youtubeUrl: blogger.youtubeUrl
        }
    },
    async deleteBloggerById(id: ObjectId): Promise<boolean> {
        return await bloggersRepository.deleteBloggerById(id)
    },
    async updateBloggerById(id: ObjectId, updateParam: BloggerInputModel): Promise<boolean> {
        return await bloggersRepository.updateBloggerById(id, updateParam)
    },
    async createBlogger(createParam: BloggerInputModel): Promise<BloggerViewModel>{
        const newBlogger: BloggerModel = {
            ...createParam,
            _id: new ObjectId()
        }
        await bloggersRepository.createBlogger(newBlogger)
        return {
            id: newBlogger._id.toString(),
            name: newBlogger.name,
            youtubeUrl: newBlogger.youtubeUrl
        }
    }
}