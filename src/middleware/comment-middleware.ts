import {body} from "express-validator";

export const commentValidation = body('content')
    .exists()
    .notEmpty()
    .isLength({min: 20, max: 100})
    .withMessage('Max 100 symbols')