import {usersCollection} from "./db";
import {PaginationUsers, UserAccount, UserQuery, UserViewModel} from "../types/user.type";
import {ObjectId} from "mongodb";

export const usersRepository = {

    async getUsers(queryParams?: UserQuery): Promise<PaginationUsers> {

        let pageNumber = Number(queryParams?.PageNumber) || 1
        let pageSize = Number(queryParams?.PageSize) || 10
        const skip: number = (pageNumber-1) * pageSize
        let count = await usersCollection.countDocuments()
        const filter = {}
        const items = await usersCollection.find(filter).skip(skip).limit(pageSize).toArray()

        const result: PaginationUsers = {
            pagesCount: Math.ceil(count/pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount: count,
            items: items.map(item =>{
                return{
                    id: item._id.toString(),
                    login: item.accountData.userName
                }
            })
        }
        return result
    },

    async createUser(createParam: UserAccount): Promise<UserAccount>{
        await usersCollection.insertOne(createParam)
        return createParam
    },

    async findUserById(_id: ObjectId): Promise<UserAccount | null>{
        const user = await usersCollection.findOne({_id})
        if(user) return user
        return null
    },

    async findByLogin(login: string): Promise<UserAccount | null>{
        const user = await usersCollection.findOne({"accountData.userName": login})
        if(user) return user
        return null
    },

    async findUserByEmail(email: string): Promise<UserAccount | null>{
        const user = await usersCollection.findOne({"accountData.email": email})
        if(user) return user
        return null
    },

    async checkUserEmailOrLogin(LoginOrEmail: string): Promise<UserAccount | null>{
        const user = await usersCollection.findOne({
            $or:
                [
                    {"accountData.userName": LoginOrEmail},
                    {"accountData.email": LoginOrEmail}
                ]
        })
        if(user) return user
        return null
    },

    async findByConfirmCode(code: string): Promise<UserAccount | null>{
        console.log(0,5)
        const user = await usersCollection.findOne({"emailConfirmation.confirmationCode": code} )
        if(user) return user
        return null
    },


    async updateConfirmationState(_id: ObjectId): Promise<boolean>{
        const result = await usersCollection.updateOne({_id}, {$set: {'emailConfirmation.isConfirmed': true}})
        return result.modifiedCount === 1
    },

    async updateConfirmationCode(_id: ObjectId, code: string): Promise<boolean>{
        const result = await usersCollection.updateOne({_id}, {$set: {'emailConfirmation.confirmationCode': code}})
        return result.modifiedCount === 1
    },

    async deleteUserById(_id: ObjectId): Promise<boolean> {
        const result = await usersCollection.deleteOne({_id})
        return result.deletedCount === 1
    },
}