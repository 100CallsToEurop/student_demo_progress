import {Request, Response, Router} from "express";
import {bloggersService} from "../domian/bloggers.service";
import {inputValidatorMiddleware} from "../middleware/input-validator-middleware";
import {authMiddleware} from "../middleware/auth-middleware";
import {nameValidation, titleValidation} from "../middleware/blogger-middleware";
import {contentValidation, shortDescriptionValidation, titleValidationPosts} from "../middleware/post-middleware";
import {postsService} from "../domian/posts.services";
import {BloggerInputModel, BloggerPostInputModel, BloggerQuery} from "../types/blogger.type";
import {PostQuery} from "../types/post.type";
import {ObjectId} from "mongodb";


export const bloggersRouter = Router({})

bloggersRouter.get('/', async (req: Request, res: Response) => {
    const {SearchNameTerm, PageNumber, PageSize}: BloggerQuery = req.query
    const bloggers = await bloggersService.getBloggers({ SearchNameTerm, PageNumber, PageSize})
    res.status(200).json(bloggers)
})
bloggersRouter.get('/:id', async (req: Request, res: Response) => {
    const id = new ObjectId(req.params.id)
    const blogger = await bloggersService.getBloggerById(id)
    if (blogger) {
        res.status(200).json(blogger)
        return
    }
    res.status(404).send('Not found')
})
bloggersRouter.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
    const id = new ObjectId(req.params.id)
    if (await bloggersService.deleteBloggerById(id)) {
        res.status(204).send('No Content')
        return
    }
    res.status(404).send('Not found')
})
bloggersRouter.post('/',
    authMiddleware,
    nameValidation,
    titleValidation,
    inputValidatorMiddleware,
    async (req: Request, res: Response) => {
    const {name, youtubeUrl}: BloggerInputModel = req.body
    const newBloger = await bloggersService.createBlogger({name, youtubeUrl})
    if(newBloger) {
        res.status(201).json(newBloger)
        return
    }
    res.status(400).send('Bad request')

})
bloggersRouter.put('/:id',
    authMiddleware,
    nameValidation,
    titleValidation,
    inputValidatorMiddleware,
    async (req: Request, res: Response)=>{
    const id = new ObjectId(req.params.id)
    const {name, youtubeUrl} = req.body
    const isUpdate = await bloggersService.updateBloggerById(id, {name, youtubeUrl})
    if (isUpdate) {
        const blogger = await bloggersService.getBloggerById(id)
        res.status(204).json(blogger)
        return
    }
    res.status(404).send('NotFound')
})

//for Posts
bloggersRouter.get('/:bloggerId/posts', async (req: Request, res: Response) => {
    const id = req.params.bloggerId
    const {PageNumber, PageSize}: PostQuery = req.query
    const bloggerPosts = await postsService.getPosts({id, PageNumber, PageSize})
    if (bloggerPosts) {
        res.status(200).json(bloggerPosts)
        return
    }
    res.status(404).send('Not found')
})
bloggersRouter.post('/:bloggerId/posts',
    authMiddleware,
    titleValidationPosts,
    shortDescriptionValidation,
    contentValidation,
    inputValidatorMiddleware,
    async (req: Request, res: Response) => {
        const bloggerId = req.params.bloggerId
        const {title, shortDescription, content}: BloggerPostInputModel  = req.body
        const newBlogPost = await postsService.createPost({title, shortDescription, content, bloggerId})
       if(newBlogPost) {
            res.status(201).send(newBlogPost)
            return
        }
        res.status(404).send('Not found')
    })