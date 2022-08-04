import {Request, Response, NextFunction} from "express";
import {jwtService} from "../applications/jwt-service";
import {ObjectId} from "mongodb";
import {UsersRepository} from "../repositories/users-repository-db";

export const validRefreshToken = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies["refreshToken"]
    console.log(token)
    console.log(token + " " + await jwtService.getUserIdByToken(token))
    if(!token || !await jwtService.getUserIdByToken(token)){
        res.send(401)
        return
    }
    next()
    return
}
