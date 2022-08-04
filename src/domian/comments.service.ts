import "reflect-metadata"
import {
    CommentInputModel,
    CommentModel,
    CommentQuery,
    CommentViewModel,
    PaginationComments
} from "../types/comment.type";
import {ObjectId} from "mongodb";
import {injectable} from "inversify";
import {UsersService} from "./users.service";
import {CommentsRepository} from "../repositories/comments-repository-db";
import {PostsService} from "./posts.services";

@injectable()
export class CommentService{

    constructor(
        private commentsRepository: CommentsRepository,
        private postsService: PostsService,
        private usersService: UsersService
    ) {}

    async createComment(
        userId: ObjectId,
        postId: ObjectId,
        createParam: CommentInputModel
    ):Promise<CommentViewModel | null> {
        const user = await this.usersService.findUserById(userId)
        const posts = await this.postsService.getPostById(postId)
        if (!posts) return null
        const newComment: CommentModel = {
            _id: new ObjectId(),
            content: createParam.content,
            userId: userId.toString(),
            userLogin: user!.login,
            addedAt: (new Date()).toString(),
            postId: postId.toString()
        }
        await this.commentsRepository.createComments(newComment)
        return {
            id: newComment._id.toString(),
            content: newComment.content,
            userId: newComment.userId,
            userLogin: newComment.userLogin,
            addedAt: newComment.addedAt

        }
    }

    async getComments(queryParams: CommentQuery): Promise<PaginationComments | null>{
        if(queryParams.postId !== undefined) {
            const posts = await this.postsService.getPostById(new ObjectId(queryParams.postId))
            if (!posts) return null
        }
        return await this.commentsRepository.getComments(queryParams)
    }

    async updateCommentById(id: ObjectId, updateComment: CommentInputModel): Promise<boolean>{
        return await this.commentsRepository.updateCommentById(id, updateComment)
    }
    async getCommentById(commentId: ObjectId): Promise<CommentViewModel | null> {
        const comment = await this.commentsRepository.getCommentById(commentId)
        if(!comment) return null
        return {
            id: comment._id.toString(),
            content: comment.content,
            userId: comment.userId,
            userLogin: comment.userLogin,
            addedAt: comment.addedAt
        }
    }
    async deleteCommentById(id: ObjectId){
        return await this.commentsRepository.deleteCommentById(id)
    }
    async checkCommentById(currentUserId: ObjectId, id: ObjectId){
        const comment = await this.commentsRepository.getCommentById(id)
        if(!comment) return null
        const userCheck = await this.usersService.findUserById(new ObjectId(comment.userId))
        if(currentUserId.toString() === userCheck!.id) return true
        return false
    }
}
