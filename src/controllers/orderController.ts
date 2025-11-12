import { Response, Request } from 'express';
import Order from '../models/Order';
import MenuItem from '../models/MenuItem';


const createOrder = async (req: any, res: Response): Promise<void> => {
    try {
        const { items, deliveryAddress, phoneNumber } = req.body;

        let totalAmount = 0;
        const orderItems = [];

        for (const item of items) {
            const menuItem = await MenuItem.findById(item.menuItem);
            if (!menuItem) {
                res.status(404).json({ message: `Menu item ${item.menuItem} not found` });
                return;
            }

            totalAmount += menuItem.price * item.quantity;
            orderItems.push({
                menuItem: menuItem._id,
                quantity: item.quantity,
                price: menuItem.price
            });
        }

        const order = new Order({
            customer: req.user?.id,
            items: orderItems,
            totalAmount,
            deliveryAddress,
            phoneNumber
        });

        await order.save();
        await order.populate('items.menuItem');

        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: (error as Error).message });
    }
};

const getUserOrders = async (req: any, res: Response): Promise<void> => {
    try {
        const orders = await Order.find({ customer: req.user?._id })
            .populate('items.menuItem')
            .sort({ createdAt: -1 });

        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: (error as Error).message });
    }
};

const getAllOrders = async (req: any, res: Response): Promise<void> => {
    try {
        const orders = await Order.find()
            .populate('items.menuItem')
            .populate('customer', 'name email')
            .sort({ createdAt: -1 });

        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: (error as Error).message });
    }
};

const updateOrderStatus = async (req: Request, res: Response): Promise<void> => {
    try {
        const { status } = req.body;

        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true, runValidators: true }
        ).populate('items.menuItem').populate('customer', 'name email');

        if (!order) {
            res.status(404).json({ message: 'Order not found' });
            return;
        }

        res.json(order);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: (error as Error).message });
    }
};

const deleteOrder = async (req: Request, res: Response): Promise<void> => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);

        if (!order) {
            res.status(404).json({ message: 'Order not found' });
            return;
        }

        res.json({ message: 'Order deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: (error as Error).message });
    }
};

export {
    getAllOrders,
    getUserOrders,
    createOrder,
    updateOrderStatus,
    deleteOrder
}