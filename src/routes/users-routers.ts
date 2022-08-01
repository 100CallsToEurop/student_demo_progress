import {Request, Response, Router} from "express";
import {usersService} from "../domian/users.service";
import {authMiddleware} from "../middleware/auth-middleware";
import {inputValidatorMiddleware} from "../middleware/input-validator-middleware";

import {UserInputModel, UserQuery} from "../types/user.type";
import { ObjectId } from 'mongodb'
import {loginValidation, passwordValidation} from "../middleware/registration-middleware";

export const usersRouter = Router({})

usersRouter.get('/', async (req: Request, res: Response) => {
        const {PageNumber, PageSize}: UserQuery = req.query
        const users = await usersService.getUsers({ PageNumber, PageSize})
        res.status(200).json(users)
})

usersRouter.post('/',
    authMiddleware,
    loginValidation,
    passwordValidation,
    inputValidatorMiddleware,
    async (req: Request, res: Response) =>{
    const {login, email, password}: UserInputModel = req.body
    const newUser = await usersService.createUser({login, email, password})
    if(newUser) {
        res.status(201).send(newUser)
        return
    }
    res.status(400).send('Bad request')
})

usersRouter.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
        const id = new ObjectId(req.params.id)
        if (await usersService.deleteUserById(id)) {
            res.status(204).send('No Content')
            return
        }
        res.status(404).send('Not found')
    })

