import { check } from 'express-validator';

// validate email and password
export const useSignUpValidator = [
    check('name').not().isEmpty().withMessage('Name is required!'),
    check('email').isEmail().withMessage('Email is required and must be valid!'),
    check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long!')
];

export const useSignInValidator = [
    check('email').isEmail().withMessage('Email is required and must be valid!'),
    check('password').isLength({min: 6}).withMessage('Pawword must be at least 6 characters long!')
]; 