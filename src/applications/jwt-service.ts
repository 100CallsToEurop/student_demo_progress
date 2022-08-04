
import jwt from 'jsonwebtoken'
import {UserViewModel} from "../types/user.type";

export const jwtService = {
   async createJWT(user: UserViewModel){
      const accessToken = jwt.sign({userId: user.id}, '123', {expiresIn: 10, notBefore: 10})
      const refreshToken = jwt.sign({userId: user.id}, '123', {expiresIn: 20, notBefore: 20})
      return {
         accessToken,
         refreshToken
      }
   },
   async getUserIdByToken(token: string){
      try{
         const result: any = jwt.verify(token, '123')
         return result.userId
      }catch(err){
         return null
      }
   },

   expToken(token: string){
      try{
         const result: any = jwt.verify(token, '123')
         return true
      }catch(err){
         return false
      }
   }
}