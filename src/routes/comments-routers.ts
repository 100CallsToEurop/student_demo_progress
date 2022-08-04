import "reflect-metadata"
import {Router} from "express";
import {commentValidation} from "../middleware/comment-middleware";
import {inputValidatorMiddleware} from "../middleware/input-validator-middleware";
import {authMiddlewareJWT} from "../middleware/auth-middleware-jwt";
import {container} from "../composition-root";
import {CommentController} from "../controllers/comment.controller";


const commentController = container.resolve(CommentController)

export const commentsRouter = Router({})

commentsRouter.get('/:id', commentController.getComment.bind(commentController))
commentsRouter.put('/:commentId',
    authMiddlewareJWT,
    commentValidation,
    inputValidatorMiddleware,
    commentController.updateComment.bind(commentController))
commentsRouter.delete('/:commentId',
    authMiddlewareJWT,
    commentController.deleteComment.bind(commentController))

