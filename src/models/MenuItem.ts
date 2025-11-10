import mongoose, { Document, Schema } from 'mongoose';
import { IMenuItem } from '../types';

const menuItemSchema: Schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    image: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

export default mongoose.model<IMenuItem>('MenuItem', menuItemSchema);