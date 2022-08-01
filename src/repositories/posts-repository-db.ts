import {commentsCollection, postsCollection} from "./db";
import {PaginationPosts, PostInputModel, PostModel, PostQuery, PostViewModel} from "../types/post.type";
import {ObjectId} from "mongodb";


export const postsRepository = {
    async getPosts(queryParams?: PostQuery): Promise<PaginationPosts> {
        const pageNumber = Number(queryParams?.PageNumber) || 1
        const pageSize = Number(queryParams?.PageSize) || 10
        const skip: number = (pageNumber-1) * pageSize
        let count = 0

        let filter: any = {}
        if(queryParams?.id !== undefined){
            filter['bloggerId'] = queryParams.id
            count = (await postsCollection.find(filter).toArray()).length
        }
        else{
            count = await postsCollection.countDocuments()
        }
        const items = await postsCollection.find(filter).skip(skip).limit(pageSize).toArray()

        const result: PaginationPosts= {
            pagesCount: Math.ceil(count/pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount: count,
            items: items.map(item =>{
                return {
                    id: item._id.toString(),
                    title: item.title,
                    shortDescription: item.shortDescription,
                    content: item.content,
                    bloggerId: item.bloggerId,
                    bloggerName: item.bloggerName
                }
            })
        }

        return result
    },
    async getPostById(_id: ObjectId) {
        let post = await postsCollection.findOne({_id})
        if(post) return post
        return null
    },
    async deletePostById(_id: ObjectId): Promise<boolean> {
        await commentsCollection.deleteMany({postId: _id.toString()})
        const result = await postsCollection.deleteOne({_id})
        return result.deletedCount === 1
    },
    async updatePostById(_id: ObjectId, updatePost: PostInputModel): Promise<boolean> {
        const result = await postsCollection.updateOne({_id}, {$set: updatePost})
        return result.matchedCount === 1
    },
    async createPost(createParam: PostModel): Promise<PostModel> {
        await postsCollection.insertOne(createParam)
        return createParam
    }
}