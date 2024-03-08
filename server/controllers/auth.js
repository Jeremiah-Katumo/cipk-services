import UserSchema from '../models/User.js';
import shortId from 'shortid';
import jwtT from 'jsonwebtoken';
import { expressjwt as jwt } from 'express-jwt';
import dotEnv from 'dotenv';

dotEnv.config();

export const signUp = (req, res) => {
    const {name, email, password} = req.body;

    // check if user already exists in database
    UserSchema.findOne({email}).exec((err, user) => {
        if (user) {
            return res.status(400).json({
                error: 'User already exists'
            })
        }
        // create a new user
        let username = shortId.generate();
        let profile = `${process.env.CLIENT_URL}/profile/${username}`;

        let newUser = new UserSchema({
            username,
            name,
            email,
            password,
            profile
        });
        // save new user
        newUser.save((err, success) => {
            if (err) {
                return res.status(400).json({
                    error: err
                })
            }
            res.json({
                message: 'Signup Sucessful'
            })
        }) 
    })
}

export const signIn = (req, res) => {
    // check if user already exists
    const {email, password} = req.body;
    UserSchema.findOne({email}).exec((err, user) => {
        if (err || !user) {
            return re.status(400).json({
                error: 'Email does not exist'
            })
        }
        // authenticate
        if (!user.authenticate(password)) {
            return res.status(400).json({
                error: 'Email and Password do not match'
            })
        }
        //generate a token and send to client
        const token = jwtT.sign({_id: user._id}, process.env.JWT_SECRET, { expiresIn: '1d'});
        // cookie
        res.cookie('token', token, {expiresIn: '1d'});
        // user
        const {_id, username, name, email, role} = user;
        return res.json({
            token,
            user
        })
    })
}

export const requiresSignIn = jwt({
    secret: process.env.JWT_SECRET,
    userProperty: 'auth',
    algorithms: ['HS256'],
});

export const SignOut = (Req, res) => {
    // clear cookie after signout
    res.clearCookie('token');
    res.json({
        message: 'Signout successful'
    })
}

export const authMiddleware = (req, res, next) => {
    const authUserId = req.auth._id;
    // find user by id
    UserSchema.findById(authUserId).exec((err, user) => {
        if (err || !user) {
            return res.satus(400).json({
                error: 'User not found'
            })
        }
        // add user to request
        req.profile = user;
        next();
    })
}

export const adminMiddleware = (req, res, next) => {
    const adminUserId = req.auth._id;
    // find user by id
    UserSchema.findById(adminUserId).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: 'User not found'
            })
        }
        if (user.role !== 1) {
            return res.status(400).json({
                error: 'Admin resource. Access denied'
            })
        }
        req.profile = user;
        next();
    })
}