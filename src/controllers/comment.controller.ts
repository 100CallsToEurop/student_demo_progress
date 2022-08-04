import "reflect-metadata"
import {injectable} from "inversify";
import {Request, Response} from "express";
import {ObjectId} from "mongodb";
import {CommentInputModel} from "../types/comment.type";
import {CommentService} from "../domian/comments.service";

@injectable()
export class CommentController{

    constructor(private commentsService: CommentService) {}

    async getComment(req: Request, res: Response){
        const id = new ObjectId(req.params.id)
        const comment = await this.commentsService.getCommentById(id)
        if (comment) {
            res.status(200).json(comment)
            return
        }
        res.status(404).send('Not found')
    }

    async updateComment(req: Request<{ commentId: string }>, res: Response){
        const id = new ObjectId(req.params.commentId)
        const {content}: CommentInputModel = req.body
        const myComment = await this.commentsService.checkCommentById(req.user!._id, id)
        if(myComment === null) {
            res.status(404).send('Not found')
            return
        }
        if(myComment === false) {
            res.status(403).send(403)
            return
        }
        const isUpdate = await this.commentsService.updateCommentById(id,{content})
        if (isUpdate) {
            res.status(204).send('No Content')
            return
        }
        res.status(404).send('Not found')
    }

    async deleteComment(req: Request<{commentId: string}>, res: Response){
        const commentId = new ObjectId(req.params.commentId)
        const myComment = await this.commentsService.checkCommentById(req.user!._id, commentId)
        if(myComment === null) {
            res.status(404).send('Not found')
            return
        }
        if(myComment === false) {
            res.status(403).send(403)
            return
        }
        await this.commentsService.deleteCommentById(commentId)
        res.status(204).send('No Content')
        return
    }
}