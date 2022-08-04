import "reflect-metadata"
import bcrypt from 'bcrypt'
import {UsersRepository} from "../repositories/users-repository-db";
import {PaginationUsers, UserInputModel, UserQuery, UserViewModel} from "../types/user.type";
import {v4 as uuidv4} from "uuid";
import add from 'date-fns/add'
import {ObjectId} from "mongodb";
import {emailManager} from "../managers/registration-user";
import {LoginInputModel} from "../types/login.type";
import {UserServiceClass} from "./classes/user.service.class";
import {injectable} from "inversify";


@injectable()
export class UsersService{
    constructor(private usersRepository: UsersRepository){}

    async createUser(userParam: UserInputModel): Promise<UserViewModel | null>{
        const passwordHash = await this._generateHash(userParam.password)
        const newUser = new UserServiceClass(
            new ObjectId(),
            {
                userName: userParam.login,
                email: userParam.email,
                passwordHash,
                createAt: new Date()
            },
            {
                confirmationCode: uuidv4(),
                expirationDate: add(new Date(), {
                    hours: 1,
                    minutes: 3
                }),
                isConfirmed: true
            }
        )
        await this.usersRepository.createUser(newUser)
        return {
            id: newUser._id.toString(),
            login: newUser.accountData.userName,
        }
    }

    async getUsers(queryParams?: UserQuery): Promise<PaginationUsers>{
        return this.usersRepository.getUsers(queryParams)
    }

    async findUserById(id: ObjectId): Promise<UserViewModel | null> {
        const user = await this.usersRepository.findUserById(id)
        if(user) {
            return {
                id: user._id.toString(),
                login: user.accountData.userName,
            }
        }
        return null
    }

    async getMe(id: ObjectId){
        const user = await this.usersRepository.findUserById(id)
        if(user) {
            return {
                userId: user._id.toString(),
                email: user.accountData.email,
                login: user.accountData.userName
            }
        }
        return null
    }

    async deleteUserById(id: ObjectId){
        return await this.usersRepository.deleteUserById(id)
    }

    async _generateHash(password: string){
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password, salt)
        return hash
    }

    async _isPasswordCorrect(password: string, hash: string){
        const isEqual = await bcrypt.compare(password, hash)
        return isEqual
    }
}
