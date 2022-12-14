import {Request, Response, NextFunction} from "express";
import {jwtService} from "../applications/jwt-service";
import {ObjectId} from "mongodb";
import {UsersRepository} from "../repositories/users-repository-db";

export const authMiddlewareJWT = async (req: Request, res: Response, next: NextFunction) => {
    if(!req.headers.authorization){
        res.send(401)
        return
    }

    const token = req.headers.authorization.split(" ")[1]
    const user = await jwtService.decodeToken(token)
    if(user){
        const usersService = new UsersRepository()
        req.user = await usersService.findUserById(new ObjectId(user.userId))
        next()
        return
    }
    res.send(401)
}
