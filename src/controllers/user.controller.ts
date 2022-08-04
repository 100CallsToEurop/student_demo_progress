import "reflect-metadata"
import {UsersService} from "../domian/users.service";
import {Request, Response} from "express";
import {UserInputModel, UserQuery} from "../types/user.type";
import {ObjectId} from "mongodb";
import {injectable} from "inversify";


@injectable()
export class UsersController {

    constructor(private usersService: UsersService) {}

    async createUsers(req: Request, res: Response) {
        const {login, email, password}: UserInputModel = req.body
        const newUser = await this.usersService.createUser({login, email, password})
        if (newUser) {
            res.status(201).send(newUser)
            return
        }
        res.status(400).send('Bad request')
    }

    async deleteUser(req: Request<{id: string}>, res: Response){
        const id = new ObjectId(req.params.id)
        if (await this.usersService.deleteUserById(id)) {
            res.status(204).send('No Content')
            return
        }
        res.status(404).send('Not found')
    }

    async getUser(req: Request<{id: string}>, res: Response){
        const id = new ObjectId(req.params.id)
        const users = await this.usersService.findUserById(id)
        res.status(200).json(users)
    }

    async getUsers(req: Request<{PageNumber: string, PageSize: string}>, res: Response){
        const {PageNumber, PageSize}: UserQuery = req.query
        const users = await this.usersService.getUsers({PageNumber, PageSize})
        res.status(200).json(users)
    }
}
