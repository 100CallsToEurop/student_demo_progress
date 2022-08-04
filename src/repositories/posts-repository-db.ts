import "reflect-metadata"
import {PaginationPosts, PostInputModel, PostModel, PostQuery} from "../types/post.type";
import {ObjectId} from "mongodb";
import {IPost, PostsModel} from "../models/post.model";
import {CommentModel} from "../models/comment.model";
import {injectable} from "inversify";

@injectable()
export class PostsRepository{
    async getPosts(queryParams?: PostQuery): Promise<PaginationPosts> {
        let totalCount = 0
        let filter = PostsModel.find()
        if(queryParams?.id !== undefined){
            filter.where({bloggerId: queryParams.id})
            totalCount = (await PostsModel.find(filter).lean()).length
        }
        else{
            totalCount = await PostsModel.count()
        }

        const page = Number(queryParams?.PageNumber) || 1
        const pageSize = Number(queryParams?.PageSize) || 10
        const skip: number = (page-1) * pageSize
        const pagesCount = Math.ceil(totalCount/pageSize)
        const items = await PostsModel.find(filter).skip(skip).limit(pageSize).lean()
        return {
            pagesCount,
            page,
            pageSize,
            totalCount,
            items: items.map(item =>{
                return{
                    id: item._id.toString(),
                    title: item.title,
                    shortDescription: item.shortDescription,
                    content: item.content,
                    bloggerId: item.bloggerId,
                    bloggerName: item.bloggerName,
                }
            })
        }
    }
    async getPostById(_id: ObjectId): Promise< IPost| null> {
        return PostsModel.findOne({_id})
    }
    async deletePostById(_id: ObjectId): Promise<boolean> {
        const commentInstance = await CommentModel.findOne({postId: _id.toString()})
        if(commentInstance){
            await commentInstance.delete({postId: _id.toString()})
        }
        const postInstance = await PostsModel.findOne({_id})
        if(!postInstance) return false
        await postInstance.delete({bloggerId: _id.toString()})
        return true
    }
    async updatePostById(_id: ObjectId, updatePost: PostInputModel): Promise<boolean> {
        const postInstance = await PostsModel.findOne({_id})
        if(!postInstance) return false
        postInstance.title = updatePost.title
        postInstance.shortDescription= updatePost.shortDescription
        postInstance.content = updatePost.content
        postInstance.bloggerId = updatePost.bloggerId
        await postInstance.save()
        return true
    }
    async createPost(createParam: IPost): Promise<PostModel> {
        const postInstance = new PostsModel()
        postInstance.title = createParam.title
        postInstance.shortDescription= createParam.shortDescription
        postInstance.content = createParam.content
        postInstance.bloggerId = createParam.bloggerId
        postInstance.bloggerName = createParam.bloggerName
        await postInstance.save()
        return createParam
    }
}