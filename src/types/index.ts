import { Document, ObjectId, } from 'mongoose';
import { Request } from 'express';

export interface IUser extends Document {
    _id: ObjectId;
    name: string;
    email: string;
    password: string;
    role: 'admin' | 'customer';
    comparePassword(candidatePassword: string): Promise<boolean>;
    createdAt: Date;
    updatedAt: Date;
}

export interface IMenuItem extends Document {
    _id: ObjectId;
    name: string;
    description: string;
    price: number;
    category: string;
    image?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface IOrderItem {
    menuItem: ObjectId;
    quantity: number;
    price: number;
}

export interface IOrder extends Document {
    _id: ObjectId;
    customer: ObjectId;
    items: IOrderItem[];
    totalAmount: number;
    status: 'ordered' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
    deliveryAddress: string;
    phoneNumber: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email?: string;
    role?: string;
  };
}

export interface JwtPayload {
    userId: string;
}