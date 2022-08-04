
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
   },

   createInvalidToken(token: string){
      try {
         const decode: any = jwt.verify(token, '123')
         const badToken = jwt.sign({userId: decode.userId, iat: 1659645696, exp: 1659645696}, '123', {
            expiresIn: 20,
            notBefore: 20
         })
         return badToken
      }catch(err){
         return null
      }
   }
}