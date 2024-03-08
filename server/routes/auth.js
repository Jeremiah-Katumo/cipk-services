import express from 'express';
import bcrypt from 'bcrypt';
import UserSchema from '../models/User.js';
// import User from '../models/User.js';

const authRouter = express.Router();

// REGISTRATION
authRouter.post('/api/register', async (req, res) => {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPass = await bcrypt.hash(req.body.password, salt);
      const newUser = new UserSchema({
        username: req.body.username,
        email: req.body.email,
        password: hashedPass,
      });
  
      const user = await newUser.save();
      res.status(200).json(user);
    } catch (err) { 
      console.error('Error during registration:', err);
      res.status(500).json(err);
    }
  });
// export const registerUser = async (req, res) => {
//     // try {
//     //     const salt = await bcrypt.genSalt(10);
//     //     const hashedPass = await bcrypt.hash(req.body.passowrd, salt);
//     //     const newUser = new UserSchema({
//     //         username: req.body.username,
//     //         email: req.body.email,
//     //         password: hashedPass,
//     //     });

//     //     const user = await newUser.save();
//     //     res.status(200).json(user);
//     // } catch (err) {
//     //     res.status(500).json(err);
//     // }
//     UserSchema.create(req.body)
//         .then(users => res.json(users))
//         .catch(err => res.json(err))
// };

// LOGIN


authRouter.post('/login', async (req, res) => {
    try {
        const user = await UserSchema.findOne({ username: req.body.username });
        !user && res.status(400).json('Wrong credentials');

        const validated = await bcrypt.compare(req.body.password, user.password);
        !validated && res.status(400).json('Wrong credentials');

        const { password, ...others } = user._doc;
        res.status(200).json(others);
    } catch (err) {
        res.status(500).json(err);
    }
});

export default authRouter;