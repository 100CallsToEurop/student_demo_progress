import {bloggersCollection, commentsCollection, postsCollection} from "./db";
import {
    BloggerInputModel,
    BloggerModel,
    BloggerQuery, BloggerViewModel,
    PaginationBloggers
} from "../types/blogger.type";
import {ObjectId} from "mongodb";

export const bloggersRepository = {
    async getBloggers(queryParams?: BloggerQuery): Promise<PaginationBloggers> {

        let pageNumber = Number(queryParams?.PageNumber) || 1
        let pageSize = Number(queryParams?.PageSize) || 10
        const skip: number = (pageNumber-1) * pageSize
        let count = await bloggersCollection.countDocuments()

        let filter: any = {}
        if(queryParams?.SearchNameTerm){
            filter['name'] = {$regex: queryParams.SearchNameTerm}
            count = (await bloggersCollection.find(filter).toArray()).length
        }

        const items = await bloggersCollection.find(filter).skip(skip).limit(pageSize).toArray()


        const result: PaginationBloggers = {
            pagesCount: Math.ceil(count/pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount: count,
            items: items.map(item =>{
                return{
                    id: item._id.toString(),
                    name: item.name,
                    youtubeUrl: item.youtubeUrl
                }
            })
        }

        return result
    },
    async getBloggerById(_id: ObjectId): Promise<BloggerModel | null> {
       const blogger = await bloggersCollection.findOne({_id})
        return blogger

    },
    async deleteBloggerById(_id: ObjectId): Promise<boolean> {
        const result = await bloggersCollection.deleteOne(_id)
        await postsCollection.deleteMany({bloggerId: _id.toString()})
        await commentsCollection.deleteMany({userId: _id.toString()})
        return result.deletedCount === 1
    },
    async updateBloggerById(_id: ObjectId, updateParam: BloggerInputModel): Promise<boolean> {
        const result = await bloggersCollection.updateOne({_id}, { $set: updateParam})
        return result.matchedCount === 1
    },
    async createBlogger(createParam: BloggerModel): Promise<BloggerModel>{
        await bloggersCollection.insertOne(createParam)
        return createParam
    }
}