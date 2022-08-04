
import jwt from 'jsonwebtoken'
import {UserViewModel} from "../types/user.type";

export const jwtService = {
   async createJWT(user: UserViewModel){
      const accessToken = jwt.sign({userId: user.id}, '123', {expiresIn: 10})
      const refreshToken = jwt.sign({userId: user.id}, '123', {expiresIn: 20})
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

   async expToken(token: string){
      try {
         const { exp } = jwt.decode(token) as {
            exp: number;
         };
         const expirationDatetimeInSeconds = exp * 1000;
         if(Date.now() >= expirationDatetimeInSeconds) return false
         return true
      } catch {
         return false;
      }
   }
}