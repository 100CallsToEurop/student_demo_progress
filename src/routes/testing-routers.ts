import {Request, Response, Router} from "express";
import {BloggerModel} from "../models/blogger.model";
import {PostsModel} from "../models/post.model";
import {CommentModel} from "../models/comment.model";
import {UserModel} from "../models/user.model";

export const testingRouter = Router({})

testingRouter.delete('/all-data', async (req: Request, res: Response) =>{
  if(await BloggerModel.deleteMany({}) &&
    await UserModel.deleteMany({}) &&
    await PostsModel.deleteMany({}) &&
    await CommentModel.deleteMany({}))
   {
        res.status(204).send('All data is deleted')
        return
    }

})