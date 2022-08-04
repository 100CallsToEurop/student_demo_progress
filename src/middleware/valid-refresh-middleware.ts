import {Request, Response, NextFunction} from "express";
import {jwtService} from "../applications/jwt-service";
import {UsersRepository} from "../repositories/users-repository-db";
import {ObjectId} from "mongodb";

export const validRefreshToken = async (req: Request, res: Response, next: NextFunction) => {
   if(req.cookies?.refreshToken){
       const token = req.cookies.refreshToken
       const userId = await jwtService.getUserIdByToken(token)
       const usersService = new UsersRepository()
       req.user = await usersService.findUserById(new ObjectId(userId))
       if(!token  || !jwtService.expToken(token)){
           res.send(401)
           return
       }
       next()
       return
   }
   else {
       res.status(401).send(401)
   }
}
