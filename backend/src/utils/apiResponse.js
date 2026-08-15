export class ApiResponse {
  static success(res, message = 'Success', data = null, statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  }

  static error(res, message = 'Internal Server Error', errorDetails = null, statusCode = 500) {
    return res.status(statusCode).json({
      success: false,
      message,
      errors: errorDetails,
    });
  }
}

export class ApiError extends Error {
  constructor(message, statusCode = 500, errors = null) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
  }
}
