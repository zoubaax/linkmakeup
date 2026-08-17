import { ApiError, ApiResponse } from '../utils/apiResponse.js';

export const errorHandler = (err, req, res, _next) => {
  const statusCode = err.statusCode || err.status || 500;

  // Log detailed stack trace only for 500 internal server errors
  if (statusCode >= 500) {
    console.error('❌ Express Server Error:', err);
  }

  if (err instanceof ApiError) {
    return ApiResponse.error(res, err.message, err.errors, err.statusCode);
  }

  // Handle SyntaxError / Bad JSON payload
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return ApiResponse.error(res, 'Malformed JSON payload', null, 400);
  }

  if (err.type === 'entity.too.large') {
    return ApiResponse.error(res, 'Request payload too large. Try a smaller image.', null, 413);
  }

  const message = process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message;

  return ApiResponse.error(res, message, err.errors || null, statusCode);
};

export const notFoundHandler = (req, res) => {
  return ApiResponse.error(res, `API route '${req.originalUrl}' not found`, null, 404);
};
