import {Request, Response, NextFunction} from "express";
import {jwtService} from "../applications/jwt-service";

export const validRefreshToken = async (req: Request, res: Response, next: NextFunction) => {
   if(req.cookies?.refreshToken){
       const token = req.cookies.refreshToken
       if(!token  || await jwtService.expToken(token) === false || !await jwtService.getUserIdByToken(token)){
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
