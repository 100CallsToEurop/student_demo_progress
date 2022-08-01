
import {commentsCollection} from "./db";
import {
    CommentInputModel,
    CommentModel,
    CommentQuery,
    PaginationComments
} from "../types/comment.type";
import {ObjectId} from "mongodb";


export const commentsRepository = {

    async getComments(queryParams?: CommentQuery): Promise<PaginationComments>{
        const pageNumber = Number(queryParams?.PageNumber) || 1
        const pageSize = Number(queryParams?.PageSize) || 10
        const skip: number = (pageNumber-1) * pageSize
        let count = await commentsCollection.countDocuments()

        let filter: any = {}
        if(queryParams?.postId !== undefined){
            filter['postId'] = queryParams.postId
            count = (await commentsCollection.find(filter).toArray()).length
        }
        else{
            count = await commentsCollection.countDocuments()
        }
        const items = await commentsCollection.find(filter).skip(skip).limit(pageSize).toArray()
        const result: PaginationComments= {
            pagesCount: Math.ceil(count/pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount: count,
            items: items.map(item =>{
                return{
                    id: item._id.toString(),
                    content: item.content,
                    userId: item.userId,
                    userLogin: item.userLogin,
                    addedAt: item.addedAt
                }
            })
        }
        return result
    },

    async createComments(createParam: CommentModel){
        await commentsCollection.insertOne(createParam)
        return createParam
    },

    async updateCommentById(_id: ObjectId, updateComment: CommentInputModel): Promise<boolean>{
        const result = await commentsCollection.updateOne({_id}, {$set: updateComment})
        return result.matchedCount === 1
    },

    async getCommentById(_id: ObjectId): Promise<CommentModel | null>{
        const comment = await commentsCollection.findOne({_id})
        if(comment) return comment
        return null
    },

    async deleteCommentById(_id: ObjectId): Promise<boolean> {
        const result = await commentsCollection.deleteOne({_id})
        return result.deletedCount === 1
    },
}