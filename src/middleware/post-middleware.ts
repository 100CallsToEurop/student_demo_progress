import {body} from "express-validator";

export const titleValidationPosts = body('title')
    .trim()
    .exists()
    .notEmpty()
    .isLength({max: 30})
    .withMessage('Max 30 symbols')

export const shortDescriptionValidation = body('shortDescription')
    .trim()
    .exists()
    .notEmpty()
    .isLength({max: 100})
    .withMessage('Max 100 symbols')

export const contentValidation = body('content')
    .trim()
    .exists()
    .notEmpty()
    .isLength({max: 1000})
    .withMessage('Max 1000 symbols')

export const bloggerIdValidation = body('bloggerId')
    //.isNumeric()
    .exists()
    .notEmpty()
    .withMessage('bloggerId must be numeric')