import { Request, Response } from 'express';
import MenuItem from '../models/MenuItem';

interface CreateMenuItemRequest extends Request {
    body: {
        name: string;
        description: string;
        price: number;
        category: string;
        image?: string;
    }
}

interface UpdateMenuItemRequest extends Request {
    params: {
        id: string;
    }
    body: Partial<{
        name: string;
        description: string;
        price: number;
        category: string;
        image: string;
    }>
}

const getMenuItems = async (req: Request, res: Response): Promise<void> => {
    try {
        const menuItems = await MenuItem.find().sort({ createdAt: -1 });
        res.json(menuItems);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: (error as Error).message });
    }
};

const createMenuItem = async (req: CreateMenuItemRequest, res: Response): Promise<void> => {
    try {
        const { name, description, price, category, image } = req.body;

        const menuItem = new MenuItem({
            name,
            description,
            price,
            category,
            image
        });

        await menuItem.save();
        res.status(201).json(menuItem);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: (error as Error).message });
    }
};

const updateMenuItem = async (req: UpdateMenuItemRequest, res: Response): Promise<void> => {
    try {
        const menuItem = await MenuItem.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!menuItem) {
            res.status(404).json({ message: 'Menu item not found' });
            return;
        }

        res.json(menuItem);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: (error as Error).message });
    }
};

const deleteMenuItem = async (req: Request, res: Response): Promise<void> => {
    try {
        const menuItem = await MenuItem.findByIdAndDelete(req.params.id);

        if (!menuItem) {
            res.status(404).json({ message: 'Menu item not found' });
            return;
        }

        res.json({ message: 'Menu item deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: (error as Error).message });
    }
};


export {
    getMenuItems,
    createMenuItem,
    updateMenuItem,
    deleteMenuItem
}