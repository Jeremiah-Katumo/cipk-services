import mongoose from 'mongoose';
import dotEnv from 'dotenv';

dotEnv.config();

const db = async () => {

    try {
        mongoose.set('strictQuery', false);
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`Database Connected: ${conn.connection.host}`);
    } catch (err) {
        console.log(err);
    }
}

export default db;