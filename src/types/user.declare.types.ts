import {UserViewModel} from "./user.type";


declare global {
    namespace Express {
        export interface Request {
            user: UserViewModel | null
        }
    }
}