
import bcrypt from 'bcrypt'
import {usersRepository} from "../repositories/users-repository-db";
import {PaginationUsers, UserAccount, UserInputModel, UserQuery, UserViewModel} from "../types/user.type";
import {v4 as uuidv4} from "uuid";
import add from 'date-fns/add'
import {ObjectId} from "mongodb";
import {emailManager} from "../managers/registration-user";
import {LoginInputModel} from "../types/login.type";


export const usersService= {
    async createUser(userParam: UserInputModel): Promise<UserViewModel | null>{
        const passwordHash = await this._generateHash(userParam.password)
        const newUser: UserAccount = {
            _id: new ObjectId(),
            accountData: {
                userName: userParam.login,
                email: userParam.email,
                passwordHash,
                createAt: new Date()
            },
            emailConfirmation: {
                confirmationCode: uuidv4(),
                expirationDate: add(new Date(), {
                    hours: 1,
                    minutes: 3
                }),
                isConfirmed: false
            }
        }
        await usersRepository.createUser(newUser)
        try{
            await emailManager.sendEmailConfirmationMessage(newUser)
        }catch(err){
            console.log(err)
            //await usersRepository.deleteUserById(newUser._id)
            return null
        }
        return {
            id: newUser._id.toString(),
            login: newUser.accountData.userName,
        }
    },

    async getUsers(queryParams?: UserQuery): Promise<PaginationUsers>{
        return usersRepository.getUsers(queryParams)
    },

async findUserById(id: ObjectId): Promise<UserViewModel | null> {
    const user = await usersRepository.findUserById(id)
    if(user) {
        return {
            id: user._id.toString(),
            login: user.accountData.userName,
        }
    }
    return null
},

    async deleteUserById(id: ObjectId){
        return await usersRepository.deleteUserById(id)
    },

    async checkCredentials(loginParam: LoginInputModel): Promise<UserViewModel | null>{
       const user = await usersRepository.findByLogin(loginParam.login)
        if(!user) {
            return null
        }

        if(!user.emailConfirmation.isConfirmed){
            return null
        }

        const isHashedEquals = await this._isPasswordCorrect(loginParam.password, user.accountData.passwordHash)
        if(isHashedEquals) return {
            id: user._id.toString(),
            login: user.accountData.userName
        }
        return null
    },

    async _generateHash(password: string){
       const salt = await bcrypt.genSalt(10)
       const hash = await bcrypt.hash(password, salt)
        return hash
    },

    async _isPasswordCorrect(password: string, hash: string){
        const isEqual = await bcrypt.compare(password, hash)
        return isEqual
    }

}