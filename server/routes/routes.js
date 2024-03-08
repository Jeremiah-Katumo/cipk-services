import express from 'express';
import { useSignInValidator } from '../validations/auth.js';
import { runValidation } from '../validations/index.js';
import { SignOut, signIn, signUp } from '../controllers/auth.js';
// import { registerUser, loginUser } from './auth.js';
// import CommentsSchema from '../models/CommentsPost.js';

const router = express.Router();

router.get('/', (req, res) => {
    res.send('Hello World');
});

// function insertComment() { 
//     CommentsSchema.insertMany([
//         {
//             fullName: "John Doe",
//             email: 'john@doe.com',
//             website: 'johndoe.com',
//             comment: 'I feel good about what is happening.'
//         }
//     ])
// }
// insertComment();

router.post('/register', useSignInValidator, runValidation, signUp)
    .post('/login', useSignInValidator, runValidation, signIn)
    .get('/logout', SignOut)

export default router;