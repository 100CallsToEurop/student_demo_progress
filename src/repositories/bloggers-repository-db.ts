import "reflect-metadata"
import {
    BloggerInputModel,
    BloggerQuery,
    PaginationBloggers
} from "../types/blogger.type";
import {ObjectId} from "mongodb";

import {BloggerModel, IBlogger} from "../models/blogger.model"
import {PostsModel} from "../models/post.model";
import {CommentModel} from "../models/comment.model";
import {injectable} from "inversify";



@injectable()
export class BloggersRepository{
    async getBloggers(queryParams?: BloggerQuery): Promise<PaginationBloggers> {
        let totalCount = await BloggerModel.count()
        let filter = BloggerModel.find()
        if(queryParams?.SearchNameTerm){
            filter.where("name").regex(queryParams?.SearchNameTerm)
            totalCount = (await BloggerModel.find(filter).lean()).length
        }

        const page = Number(queryParams?.PageNumber) || 1
        const pageSize = Number(queryParams?.PageSize) || 10
        const skip: number = (page-1) * pageSize
        const pagesCount = Math.ceil(totalCount/pageSize)
        const items = await BloggerModel.find(filter).skip(skip).limit(pageSize).lean()

        return {
            pagesCount,
            page,
            pageSize,
            totalCount,
            items: items.map(item =>{
                return{
                    id: item._id.toString(),
                    name: item.name,
                    youtubeUrl: item.youtubeUrl
                }
            })
        }
    }

    async getBloggerById(_id: ObjectId): Promise<IBlogger | null> {
        return BloggerModel.findOne({_id})
    }
    async deleteBloggerById(_id: ObjectId): Promise<boolean> {
        const postInstance = await PostsModel.findOne({bloggerId: _id.toString()})
        if(postInstance){
            const commentInstance = await CommentModel.findOne({postId: postInstance._id})
            if(commentInstance){
                await commentInstance.delete({_id: commentInstance._id})
            }
            await postInstance.delete({bloggerId: _id.toString()})
        }
        const bloggerInstance = await BloggerModel.findOne({_id})
        if(!bloggerInstance) return false
        await bloggerInstance.delete({_id})
        return true
    }
    async updateBloggerById(_id: ObjectId, updateParam: BloggerInputModel): Promise<boolean> {
        const bloggerInstance = await BloggerModel.findOne({_id})
        if(!bloggerInstance) return false
        bloggerInstance.name = updateParam.name
        bloggerInstance.youtubeUrl = updateParam.youtubeUrl
        await bloggerInstance.save()
        return true
    }
    async createBlogger(createParam: IBlogger): Promise<IBlogger>{
        const bloggerInstance = new BloggerModel()
        bloggerInstance.name = createParam.name
        bloggerInstance.youtubeUrl = createParam.youtubeUrl
        await bloggerInstance.save()
        return bloggerInstance
    }
}