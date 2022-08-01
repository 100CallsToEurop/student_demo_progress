import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'

//Routers
import {bloggersRouter} from "./routes/bloggers-routes";
import {postsRouter} from "./routes/posts-routes";
import {authRouter} from "./routes/auth-routers";

//Database
import {runDb} from "./repositories/db";
import {usersRouter} from "./routes/users-routers";
import {commentsRouter} from "./routes/comments-routers";
import {testingRouter} from "./routes/testing-routers";


//Constant
const jsonMiddleware = bodyParser.json()
const port = process.env.PORT || 5000
const app = express()

app.use(cors())
app.use(jsonMiddleware)
app.set('trust proxy', true);

app.use('/auth', authRouter)
app.use('/users', usersRouter)
app.use('/comments', commentsRouter)
app.use('/bloggers', bloggersRouter)
app.use('/posts', postsRouter)
app.use('/testing', testingRouter)

const startApp = async() =>{
    await runDb()
    app.listen(port, ()=>{
        console.log(`Example app listening on port ${port}`)
    })
}

startApp()

