import {commentsRepository} from "../repositories/comments-repository-db";
import {postsService} from "./posts.services";
import {usersService} from "./users.service";
import {
    CommentInputModel,
    CommentModel,
    CommentQuery,
    CommentViewModel,
    PaginationComments
} from "../types/comment.type";
import {ObjectId} from "mongodb";


export const commentsService= {

    async createComment(
        userId: ObjectId,
        postId: ObjectId,
        createParam: CommentInputModel
    ):Promise<CommentViewModel | null> {
        console.log(1)
        const user = await usersService.findUserById(userId)
        console.log(2)
        const posts = await postsService.getPostById(postId)
        console.log(3)
        if (!posts) return null
        const newComment: CommentModel = {
            _id: new ObjectId(),
            content: createParam.content,
            userId: userId.toString(),
            userLogin: user!.login,
            addedAt: (new Date()).toString(),
            postId: postId.toString()
        }
        await commentsRepository.createComments(newComment)
        return {
            id: newComment._id.toString(),
            content: newComment.content,
            userId: newComment.userId,
            userLogin: newComment.userLogin,
            addedAt: newComment.addedAt

        }
    },

    async getComments(queryParams: CommentQuery): Promise<PaginationComments | null>{
        if(queryParams.postId !== undefined) {
            const posts = await postsService.getPostById(new ObjectId(queryParams.postId))
            if (!posts) return null
        }
        return await commentsRepository.getComments(queryParams)
    },

    async updateCommentById(id: ObjectId, updateComment: CommentInputModel): Promise<boolean>{
        return await commentsRepository.updateCommentById(id, updateComment)
    },
    async getCommentById(commentId: ObjectId): Promise<CommentViewModel | null> {
        const comment = await commentsRepository.getCommentById(commentId)
        if(!comment) return null
        return {
            id: comment._id.toString(),
            content: comment.content,
            userId: comment.userId,
            userLogin: comment.userLogin,
            addedAt: comment.addedAt
        }
    },
   async deleteCommentById(id: ObjectId){
       return await commentsRepository.deleteCommentById(id)
   },
   async checkCommentById(currentUserId: ObjectId, id: ObjectId){
        const comment = await commentsRepository.getCommentById(id)
       if(!comment) return null
       const userCheck = await usersService.findUserById(new ObjectId(comment.userId))
       if(currentUserId.toString() === userCheck!.id) return true
       return false
   }
}