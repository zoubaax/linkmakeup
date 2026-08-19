import { Router } from 'express';
import { OrderController } from '../controllers/order.controller.js';

const orderRouter = Router();

// Public endpoint for ordering NFC Smart Cards
orderRouter.post('/orders', OrderController.createOrder);

export default orderRouter;
