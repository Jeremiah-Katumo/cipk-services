import mongoose from 'mongoose';
import crypto from 'crypto';

const User = new mongoose.Schema(
    {
        username: {type: String, trim: true, unique: true, maxLength: 35, minLength: 3, index: true, lowercase: true},
        name: { type: String, required: true, maxLength: 50, minLength: 3 },
        email: { type: String, required: true, unique: true, maxLength: 50, lowercase: true },
        hashed_password: { type: String, required: true },
        profile: {type: String, lowercase: true },
        salt: String
    },
    { timestamps: true }
);

User.virtual('password').set((password) => {
    // create a temporary variable called password
    this._password = password;
    // generate timestamp
    this.salt = this.makeSalt();
    // encrypt password
    this.hashed_password = this.encryptPassword(password);
}).get(() => {
        return this._password;
    });

User.methods = {
    authenticate: (plainText) => {
        return this.encryptPassword(plainText) === this.hashed_password;
    },
    makeSalt: () => {
        return Math.round((new Date().valueOf() * Math.random())) + '';
    },
    encryptPassword: (password) => {
        if (!password) return '';
        try {
            return crypto.createHmac('shal', this.salt).update(password).digest('hex');
        } catch (err) {
            return '';
        }
    }
}

const UserSchema = mongoose.model("User", User);

export default UserSchema;