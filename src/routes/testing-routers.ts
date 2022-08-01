import {Request, Response, Router} from "express";
import {bloggersCollection, commentsCollection, postsCollection, usersCollection} from "../repositories/db";

export const testingRouter = Router({})

testingRouter.delete('/all-data', async (req: Request, res: Response) =>{
    if(await bloggersCollection.deleteMany({}) &&
    await usersCollection.deleteMany({}) &&
    await postsCollection.deleteMany({}) &&
    await commentsCollection.deleteMany({}))
   {
        res.status(204).send('All data is deleted')
        return
    }

})