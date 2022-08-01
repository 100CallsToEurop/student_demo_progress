import {MongoClient} from "mongodb";
import {BloggerModel, BloggerViewModel} from "../types/blogger.type";
import {PostModel, PostViewModel} from "../types/post.type";
import {UserAccount, UserViewModel} from "../types/user.type";
import {CommentModel, CommentViewModel} from "../types/comment.type";



const uri = `mongodb+srv://user:testDatabase@cluster0.tuuab.mongodb.net/?retryWrites=true&w=majority`;

export const client = new MongoClient(uri)
const db = client.db("backend")
export const bloggersCollection = db.collection<BloggerModel>("bloggers")
export const postsCollection = db.collection<PostModel>("posts")
export const usersCollection = db.collection<UserAccount>("users")
export const commentsCollection = db.collection<CommentModel>("comments")

export async function runDb(){
    try{
        await client.connect()
        await client.db("backend").command({ping: 1})
        console.log("Connected successfully to mongo server")
    }catch(err){
        console.log("Can't connect to db")
        console.log(err)
        await client.close()
    }
}