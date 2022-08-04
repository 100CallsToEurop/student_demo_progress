import "reflect-metadata"
import {
    CommentInputModel,
    CommentQuery,
    PaginationComments
} from "../types/comment.type";
import {ObjectId} from "mongodb";
import {CommentModel, IComment} from "../models/comment.model";
import {injectable} from "inversify";

@injectable()
export class CommentsRepository{
    async getComments(queryParams?: CommentQuery): Promise<PaginationComments>{
        let totalCount = 0
        let filter = CommentModel.find()
        if(queryParams?.postId !== undefined){
            filter.where({postId: queryParams.postId})
            totalCount = (await CommentModel.find(filter).lean()).length
        }
        else{
            totalCount = await CommentModel.count()
        }

        const page = Number(queryParams?.PageNumber) || 1
        const pageSize = Number(queryParams?.PageSize) || 10
        const skip: number = (page-1) * pageSize
        const pagesCount = Math.ceil(totalCount/pageSize)
        const items = await CommentModel.find(filter).skip(skip).limit(pageSize).lean()
        return {
            pagesCount,
            page,
            pageSize,
            totalCount,
            items: items.map(item =>{
                return{
                    id: item._id.toString(),
                    userId: item.userId,
                    content: item.content,
                    userLogin: item.userLogin,
                    addedAt: item.addedAt,
                    postId: item.postId,
                }
            })
        }
    }
    async getCommentById(_id: ObjectId): Promise<IComment | null>{
        return CommentModel.findOne({_id})
    }
    async updateCommentById(_id: ObjectId, updateComment: CommentInputModel): Promise<boolean>{
        const commentInstance = await CommentModel.findOne({_id})
        if(!commentInstance) return false
        commentInstance.content = updateComment.content,
            await commentInstance.save()
        return true
    }
    async deleteCommentById(_id: ObjectId): Promise<boolean> {
        const commentInstance = await CommentModel.findOne({_id})
        if(!commentInstance) return false
        await commentInstance.delete({_id})
        return true
    }
    async createComments(createParam: IComment){
        const commentInstance = new CommentModel()
        commentInstance.userId = createParam.userId
        commentInstance.content = createParam.content
        commentInstance.userLogin = createParam.userLogin
        commentInstance.addedAt = createParam.addedAt
        commentInstance.postId = createParam.postId
        await commentInstance.save()
        return createParam
    }
}