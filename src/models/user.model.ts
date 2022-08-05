import mongoose from "mongoose";
import {ObjectId} from "mongodb";

export interface IUser{
    _id: ObjectId
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
    sessions:{
        refreshToken: string | null
    }
}

const userSchema = new mongoose.Schema<IUser>({
    //id: { type: mongoose.Schema.Types.ObjectId, required: false },
    accountData:{
        userName: { type: String, required: true },
        email: { type: String, required: true },
        passwordHash: { type: String, required: true },
        createAt: { type: Date, required: true },
    },
    emailConfirmation:{
        confirmationCode: { type: String, required: true },
        expirationDate: { type: Date, required: true },
        isConfirmed: { type: Boolean, required: true },
    },
    sessions:{
        refreshToken: { type: String, default: null },
    }
});

export const UserModel = mongoose.model<IUser>('users', userSchema)