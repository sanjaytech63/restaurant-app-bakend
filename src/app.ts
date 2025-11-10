import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check route
app.get('/api/health', (req, res) => {
    res.json({
        message: 'Server is running!',
    });
});

// API Routes
import authRoutes from './routes/auth';
import menuRoutes from './routes/menu';
import orderRoutes from './routes/orders';
import globalErrorHandler from './middleware/globalErrorHandler';

app.use('/api/auth', authRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        message: 'Route not found',
        path: req.originalUrl
    });
});

// Global error handler
app.use(globalErrorHandler);

export default app;