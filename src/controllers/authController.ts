import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { AuthRequest } from '../types';

const generateToken = (userId: string): string => {
    return jwt.sign({ userId }, process.env.JWT_SECRET || 'fallback_secret', {
        expiresIn: '7d'
    });
};

interface RegisterRequest extends Request {
    body: {
        name: string;
        email: string;
        password: string;
        role?: 'admin' | 'customer';
    }
}

interface LoginRequest extends Request {
    body: {
        email: string;
        password: string;
    }
}

const register = async (req: RegisterRequest, res: Response): Promise<void> => {
    try {
        const { name, email, password, role } = req.body;

        let user = await User.findOne({ email });
        if (user) {
            res.status(400).json({ message: 'User already exists' });
            return;
        }

        user = new User({ name, email, password, role: role || 'customer' });
        await user.save();

        const token = generateToken(user._id.toString());

        res.status(201).json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: (error as Error).message });
    }
};

const login = async (req: LoginRequest, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            res.status(400).json({ message: 'Invalid credentials' });
            return;
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            res.status(400).json({ message: 'Invalid credentials' });
            return;
        }

        const token = generateToken(user._id.toString());

        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: (error as Error).message });
    }
};

const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        res.json({
            user: {
                id: req.user?._id,
                name: req.user?.name,
                email: req.user?.email,
                role: req.user?.role
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: (error as Error).message });
    }
};

export {
    getMe,
    login,
    register
}