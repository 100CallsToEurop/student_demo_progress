import "reflect-metadata"
import {UserAccount} from "../types/user.type";
import {emailManager} from "../managers/registration-user";
import {v4 as uuidv4} from "uuid";
import {UsersRepository} from "../repositories/users-repository-db";
import {injectable} from "inversify";
import {ObjectId} from "mongodb";

@injectable()
export class AuthService{
    constructor(private usersRepository: UsersRepository){}

    async findUserForConfirm(code: string){
        const user = await this.usersRepository.findByConfirmCode(code)
        if(!user) return false
        return await this.confirmEmail(user, code)
    }

    async confirmEmail(user:UserAccount, code: string){
        if(user.emailConfirmation.isConfirmed) return false
        if(user.emailConfirmation.confirmationCode !== code) return false
        if(user.emailConfirmation.expirationDate < new Date()) return false

        const result = await this.usersRepository.updateConfirmationState(user._id)
        return result
    }

    async findUserByEmail(email: string){
        const user = await this.usersRepository.findUserByEmail(email)
        if(!user) return false
        if(user.emailConfirmation.isConfirmed) return false
        const newCode = user.emailConfirmation.confirmationCode = uuidv4()
        await this.usersRepository.updateConfirmationCode(user._id, newCode)
        try{
            await emailManager.sendEmailConfirmationMessage(user)
        }catch(err){
            console.log(err)
            // await usersRepository.deleteUserById(user._id)
            return null
        }
        return {
            id: user._id.toString(),
            login: user.accountData.userName,
        }

    }
}
