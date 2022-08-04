import {UsersRepository} from "./repositories/users-repository-db";
import {UsersService} from "./domian/users.service";
import {UsersController} from "./controllers/user.controller";
import {Container} from "inversify";
import {AuthController} from "./controllers/auth.controller";
import {AuthService} from "./domian/auth.service";
import {CommentController} from "./controllers/comment.controller";
import {CommentService} from "./domian/comments.service";
import {CommentsRepository} from "./repositories/comments-repository-db";
import {PostsController} from "./controllers/post.controller";
import {PostsService} from "./domian/posts.services";
import {PostsRepository} from "./repositories/posts-repository-db";
import {BloggerController} from "./controllers/blogger.controller";
import {BloggersService} from "./domian/bloggers.service";
import {BloggersRepository} from "./repositories/bloggers-repository-db";

/*const objects: any[] = []

const userRepository = new UsersRepository()
objects.push(userRepository)

const userService = new UsersService(userRepository)
objects.push(userService)

const usersController = new UsersController(userService)
objects.push(usersController)

export const ioc = {
    getService<T>(ClassType: any){
        const target = objects.find(o => o instanceof ClassType)
        return target as T
    }
}*/

export const container = new Container()
//Auth
container.bind(AuthController).to(AuthController)
container.bind<AuthService>(AuthService).to(AuthService)
//User
container.bind(UsersController).to(UsersController)
container.bind<UsersService>(UsersService).to(UsersService)
container.bind<UsersRepository>(UsersRepository).to(UsersRepository)
//Comment
container.bind(CommentController).to(CommentController)
container.bind<CommentService>(CommentService).to(CommentService)
container.bind<CommentsRepository>(CommentsRepository).to(CommentsRepository)
//Blogger
container.bind(PostsController).to(PostsController)
container.bind<PostsService>(PostsService).to(PostsService)
container.bind<PostsRepository>(PostsRepository).to(PostsRepository)
//Post
container.bind(BloggerController).to(BloggerController)
container.bind<BloggersService>(BloggersService).to(BloggersService)
container.bind<BloggersRepository>(BloggersRepository).to(BloggersRepository)