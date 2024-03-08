import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const Comments = new Schema({
    fullName: { type: String, required: true, trim: true, maxLength: 100 },
    email: { type: String, required: true, trim: true, maxLength: 30 },
    website: { type: String, required: true, trim: true, maxLength: 50 },
    comment: { type: String, required: true, trim: true, maxLength: 500 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, { timestamp: true });


const CommentsSchema = mongoose.model('Comments', Comments);

export default CommentsSchema;