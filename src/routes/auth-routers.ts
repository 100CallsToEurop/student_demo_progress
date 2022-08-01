import {Request, Response, Router} from "express";
import {usersService} from "../domian/users.service";
import {jwtService} from "../applications/jwt-service";
import {LoginInputModel} from "../types/login.type";
import {RegistrationConfirmationCodeModel, RegistrationEmailResending} from "../types/registration.type";
import {
    confirmValidation,
    emailValidationRegistration, emailValidationResending,
    loginValidation,
    passwordValidation
} from "../middleware/registration-middleware";
import {UserInputModel} from "../types/user.type";
import {authService} from "../domian/auth.service";
import {checkLimitReq} from "../middleware/checkLimitRequest-middleware";
import {inputValidatorMiddleware} from "../middleware/input-validator-middleware";
import {usersRepository} from "../repositories/users-repository-db";
import {usersCollection} from "../repositories/db";

export const authRouter = Router({})

authRouter.post('/login', checkLimitReq,
    async (req: Request, res: Response) => {
        const {login, password}: LoginInputModel = req.body
        const user = await usersService.checkCredentials({login, password})
        if(user){
            const token = await jwtService.createJWT(user)
            res.status(200).json({token})
            return
        }
        res.status(401).send('Unauthorized')
    })

authRouter.post('/registration-confirmation', checkLimitReq,
    confirmValidation,
    inputValidatorMiddleware,
    async (req: Request, res: Response) => {
        const {code}: RegistrationConfirmationCodeModel = req.body
        const result = await authService.findUserForConfirm(code)
        if(result) {
            res.status(204).send('Email was verified. Account was activated')
            return
        }
        res.status(400).send({errorsMessages: [{ message: "This code already confirmed", field: "code" }]})
    })

authRouter.post('/registration',
    checkLimitReq,
    loginValidation,
    emailValidationRegistration,
    passwordValidation,
    inputValidatorMiddleware,
    async (req: Request, res: Response) => {
       const {login, email, password}: UserInputModel = req.body
       const user = await usersService.createUser({login, email, password})
        if(user){
            res.status(204).send(204)
            return
        }
        res.status(400).send('Bad request')
    })

authRouter.post('/registration-email-resending',
    checkLimitReq,
    emailValidationResending,
    inputValidatorMiddleware,
    async (req: Request, res: Response) => {
        const {email}: RegistrationEmailResending = req.body
        const result = await authService.findUserByEmail(email)
        if(result){
            res.status(204).send(204)
            return
        }
        else{
            res.status(400).send({errorsMessages: [{ message: "Bad email", field: "email" }]})
            return
        }

    })