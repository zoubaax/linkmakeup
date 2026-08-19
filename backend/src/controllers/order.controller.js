import { OrderService } from '../services/order.service.js';
import { ApiResponse, ApiError } from '../utils/apiResponse.js';

export class OrderController {
  static async createOrder(req, res, next) {
    try {
      const { fullName, phone, city, address, notes } = req.body || {};

      if (!fullName || !String(fullName).trim()) {
        throw new ApiError('Full name is required', 400);
      }
      if (!phone || !String(phone).trim()) {
        throw new ApiError('Phone number is required', 400);
      }
      if (!city || !String(city).trim()) {
        throw new ApiError('City is required', 400);
      }
      if (!address || !String(address).trim()) {
        throw new ApiError('Delivery address is required', 400);
      }

      const order = await OrderService.createOrder({
        fullName,
        phone,
        city,
        address,
        notes,
      });

      return ApiResponse.success(res, 'NFC Smart Card order submitted successfully', order, 201);
    } catch (err) {
      next(err);
    }
  }

  static async getAdminOrders(req, res, next) {
    try {
      const { page, limit, search, status } = req.query;
      const data = await OrderService.getAdminOrders({
        page,
        limit,
        search,
        status,
      });

      return ApiResponse.success(res, 'Orders fetched successfully', data);
    } catch (err) {
      next(err);
    }
  }

  static async updateOrderStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status } = req.body || {};

      if (!status) {
        throw new ApiError('Status is required', 400);
      }

      const updated = await OrderService.updateOrderStatus(id, status);
      return ApiResponse.success(res, 'Order status updated', updated);
    } catch (err) {
      next(err);
    }
  }
}
