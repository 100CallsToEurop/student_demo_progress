import {Request, Response, NextFunction} from "express";
import {jwtService} from "../applications/jwt-service";

export const validRefreshToken = async (req: Request, res: Response, next: NextFunction) => {
    console.log(1)
   if(req.cookies?.refreshToken){
       const token = req.cookies.refreshToken
       console.log(token)
       console.log(!token + " " + await jwtService.getUserIdByToken(token))
       if(!token || !await jwtService.getUserIdByToken(token)){
           res.send(401)
           return
       }
       next()
       return
   }
   else {
       console.log(2)
       res.status(401).send(401)
   }
}
