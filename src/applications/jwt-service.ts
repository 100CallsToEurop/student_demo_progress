import jwt from 'jsonwebtoken'
import {UserViewModel} from "../types/user.type";
import {usersRepository} from "../repositories/users-repository-db";
import {ObjectId} from "mongodb";

export const jwtService = {
    async createJWT(user: UserViewModel) {
        const accessToken = jwt.sign({userId: user.id}, '123', {expiresIn: 10})
        const refreshToken = jwt.sign({userId: user.id}, '123', {expiresIn: 20})
        await usersRepository.updateRefreshToken(new ObjectId(user.id), refreshToken)
        return {
            accessToken,
            refreshToken
        }
    },
    async decodeToken(token: string){
        try{
            const result: any = jwt.verify(token, '123')
            return result
        }catch(err){
            return null
        }
    },
    async checkTokenBad(token: string){
        const user = await usersRepository.findUserByRefreshToken(token)
        const badToken = await usersRepository.findBadToken(token)
        console.log(user)
        console.log(badToken)
        return true

    },
    async getUserIdByToken(token: string): Promise<UserViewModel | null> {
            const user = await usersRepository.findUserByRefreshToken(token)
            if(user){
                return {
                    id: user._id.toString(),
                    login: user.accountData.userName
                }
            }
            return null
    },

    async validateRefreshToken(refreshToken: string) {
        if (refreshToken) {
            try {
                const token = jwt.verify(refreshToken, '123')

            }catch(err){
                await this.createInvalidToken(refreshToken)
                return null
            }
        }
        return null
    },

    async createInvalidToken(token: string): Promise<boolean | null>{
        const user = await this.getUserIdByToken(token)
        if(user) {
            await usersRepository.addInBadToken(token)
            return true
        }
        return null
    }
}