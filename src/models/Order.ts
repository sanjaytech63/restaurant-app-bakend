import mongoose, { Document, Schema } from 'mongoose';
import { IOrder, IOrderItem } from '../types';

const orderItemSchema: Schema = new mongoose.Schema({
  menuItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MenuItem',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true
  }
});

const orderSchema: Schema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [orderItemSchema],
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['ordered', 'preparing', 'ready', 'delivered', 'cancelled'],
    default: 'ordered'
  },
  deliveryAddress: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

orderSchema.virtual('formattedTotal').get(function() {
  return `$${this.totalAmount.toFixed(2)}`;
});

export default mongoose.model<IOrder>('Order', orderSchema);