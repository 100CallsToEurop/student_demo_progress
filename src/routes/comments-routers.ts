import {Request, Response, Router} from "express";
import {commentsService} from "../domian/comments.service";
import {commentValidation} from "../middleware/comment-middleware";
import {inputValidatorMiddleware} from "../middleware/input-validator-middleware";
import {authMiddlewareJWT} from "../middleware/auth-middleware-jwt";
import {CommentInputModel} from "../types/comment.type";
import {ObjectId} from "mongodb";

export const commentsRouter = Router({})

commentsRouter.get('/:id', async (req: Request, res: Response) =>{
    const id = new ObjectId(req.params.id)
    const comment = await commentsService.getCommentById(id)
    if (comment) {
        res.status(200).json(comment)
        return
    }
    res.status(404).send('Not found')
})

commentsRouter.put('/:commentId',
    authMiddlewareJWT,
    commentValidation,
    inputValidatorMiddleware,
    async (req: Request, res: Response) =>{
    const id = new ObjectId(req.params.commentId)
    const {content}: CommentInputModel = req.body
        const myComment = await commentsService.checkCommentById(new ObjectId(req.user!.id), id)
        if(myComment === null) {
            res.status(404).send('Not found')
            return
        }
        if(myComment === false) {
            res.status(403).send(403)
            return
        }
    const isUpdate = await commentsService.updateCommentById(id,{content})
    if (isUpdate) {
        res.status(204).send('No Content')
        return
    }
        res.status(404).send('Not found')
})

commentsRouter.delete('/:commentId', authMiddlewareJWT, async (req: Request, res: Response) =>{
    const commentId = new ObjectId(req.params.commentId)
    const myComment = await commentsService.checkCommentById(new ObjectId(req.user!.id), commentId)
    if(myComment === null) {
        res.status(404).send('Not found')
        return
    }
    if(myComment === false) {
        res.status(403).send(403)
        return
    }
    await commentsService.deleteCommentById(commentId)
    res.status(204).send('No Content')
    return
})

