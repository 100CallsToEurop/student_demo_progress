import "reflect-metadata"
import {PaginationUsers, UserAccount, UserQuery} from "../types/user.type";
import {ObjectId} from "mongodb";
import {IUser, UserModel} from "../models/user.model";
import {injectable} from "inversify";


@injectable()
export class UsersRepository{
    async getUsers(queryParams?: UserQuery): Promise<PaginationUsers> {
        let totalCount = await UserModel.count()
        const filter = UserModel.find()
        const page = Number(queryParams?.PageNumber) || 1
        const pageSize = Number(queryParams?.PageSize) || 10
        const skip: number = (page-1) * pageSize
        const pagesCount = Math.ceil(totalCount/pageSize)
        const items = await UserModel.find(filter).skip(skip).limit(pageSize).lean()
        return {
            pagesCount,
            page,
            pageSize,
            totalCount,
            items: items.map(item =>{
                return{
                    id: item._id.toString(),
                    login: item.accountData.userName
                }
            })
        }
    }

    async findUserById(_id: ObjectId): Promise<IUser | null>{
        return UserModel.findOne({_id})
    }

    async findByLogin(login: string): Promise<IUser | null>{
        return UserModel.findOne().where({"accountData.userName": login})
    }

    async findUserByEmail(email: string): Promise<IUser | null>{
        return UserModel.findOne().where({"accountData.email": email})
    }

    async checkUserEmailOrLogin(LoginOrEmail: string): Promise<IUser | null>{
        return UserModel.findOne().where({
            $or:
                [
                    {"accountData.userName": LoginOrEmail},
                    {"accountData.email": LoginOrEmail}
                ]
        })
    }

    async findByConfirmCode(code: string): Promise<IUser | null>{
        return UserModel.findOne().where({"emailConfirmation.confirmationCode": code})
    }

    async deleteUserById(_id: ObjectId): Promise<boolean> {
        const userInstance = await UserModel.findOne({_id})
        if(!userInstance) return false
        await userInstance.delete({_id})
        return true
    }

    async updateConfirmationState(_id: ObjectId): Promise<boolean>{
        const userInstance = await UserModel.findOne({_id})
        if(!userInstance) return false
        userInstance.emailConfirmation.isConfirmed = true,
            await userInstance.save()
        return true
    }

    async updateConfirmationCode(_id: ObjectId, code: string): Promise<boolean>{
        const userInstance = await UserModel.findOne({_id})
        if(!userInstance) return false
        userInstance.emailConfirmation.confirmationCode = code,
            await userInstance.save()
        return true
    }
    async createUser(createParam: IUser): Promise<IUser>{
        const userInstance = new UserModel()
        userInstance.accountData.userName = createParam.accountData.userName
        userInstance.accountData.email = createParam.accountData.email
        userInstance.accountData.passwordHash = createParam.accountData.passwordHash
        userInstance.accountData.createAt = createParam.accountData.createAt
        userInstance.emailConfirmation.confirmationCode = createParam.emailConfirmation.confirmationCode
        userInstance.emailConfirmation.expirationDate = createParam.emailConfirmation.expirationDate
        userInstance.emailConfirmation.isConfirmed = createParam.emailConfirmation.isConfirmed
        await userInstance.save()
        return createParam
    }
}

export const usersRepository = new UsersRepository()