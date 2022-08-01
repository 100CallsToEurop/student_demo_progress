import {Query} from "./query.type";
import {Pagination} from "./pagination.types";
import {ObjectId} from "mongodb";

export type UserInputModel = {
    login: string
    email: string
    password: string
}
export type UserViewModel =  {
    id:	string,
    login: string
}

export type UserQuery = Query

export type PaginationUsers = Pagination & {
    items?: Array<UserViewModel>
}

export type UserAccount = {
   _id: ObjectId,
   accountData:{
       userName: string,
       email: string,
       passwordHash: string,
       createAt: Date
   }
   emailConfirmation:{
       confirmationCode: string,
       expirationDate: Date,
       isConfirmed: boolean,
   }

}