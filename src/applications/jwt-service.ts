
import jwt from 'jsonwebtoken'
import {UserViewModel} from "../types/user.type";

export const jwtService = {
   async createJWT(user: UserViewModel){
      const token = jwt.sign({userId: user.id}, '123', {expiresIn: '1h'})
      return token
   },
   async getUserIdByToken(token: string){
      try{
         const result: any = jwt.verify(token, '123')
         return result.userId
      }catch(err){
         return null
      }
   }
}