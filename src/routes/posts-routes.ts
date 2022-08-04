//posts
import "reflect-metadata"
import {Router} from "express";
import {inputValidatorMiddleware} from "../middleware/input-validator-middleware";
import {authMiddleware} from "../middleware/auth-middleware";
import {
    bloggerIdValidation,
    contentValidation,
    shortDescriptionValidation,
    titleValidationPosts
} from "../middleware/post-middleware";
import {authMiddlewareJWT} from "../middleware/auth-middleware-jwt";
import {commentValidation} from "../middleware/comment-middleware";
import {container} from "../composition-root";
import {PostsController} from "../controllers/post.controller";

const postsController = container.resolve(PostsController)

export const postsRouter = Router({})

postsRouter.get('/', postsController.getPosts.bind(postsController))
postsRouter.get('/:id', postsController.getPost.bind(postsController))
postsRouter.delete('/:id',
    authMiddleware,
    postsController.deletePost.bind(postsController))
postsRouter.post('/',
    authMiddleware,
    titleValidationPosts,
    shortDescriptionValidation,
    contentValidation,
    bloggerIdValidation,
    inputValidatorMiddleware,
    postsController.createPost.bind(postsController))

postsRouter.put('/:id',
    authMiddleware,
    titleValidationPosts,
    shortDescriptionValidation,
    contentValidation,
    bloggerIdValidation,
    inputValidatorMiddleware,
    postsController.updatePost.bind(postsController))

//for comments
postsRouter.get('/:postId/comments', postsController.getComments.bind(postsController))
postsRouter.post('/:postId/comments',
    authMiddlewareJWT,
    commentValidation,
    inputValidatorMiddleware,
    postsController.createComment.bind(postsController))