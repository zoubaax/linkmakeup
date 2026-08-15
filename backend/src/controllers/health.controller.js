import { HealthService } from '../services/health.service.js';
import { ApiResponse } from '../utils/apiResponse.js';

export class HealthController {
  static getStatus(req, res) {
    const status = HealthService.getHealthStatus();
    return ApiResponse.success(res, 'System healthy', status);
  }
}
