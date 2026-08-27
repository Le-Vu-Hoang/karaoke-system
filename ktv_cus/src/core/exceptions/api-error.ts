export class ApiError extends Error {
  public status: number;
  public data: unknown;

  constructor(status: number, message: string, data: unknown = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class BadRequestError extends ApiError {
  constructor(message: string, data: unknown = null) {
    super(400, message || 'Yêu cầu không hợp lệ', data);
    this.name = 'BadRequestError';
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message: string, data: unknown = null) {
    super(401, message || 'Chưa đăng nhập hoặc phiên làm việc hết hạn', data);
    this.name = 'UnauthorizedError';
  }
}

export class ForbiddenError extends ApiError {
  constructor(message: string, data: unknown = null) {
    super(403, message || 'Bạn không có quyền thực hiện hành động này', data);
    this.name = 'ForbiddenError';
  }
}

export class NotFoundError extends ApiError {
  constructor(message: string, data: unknown = null) {
    super(404, message || 'Không tìm thấy tài nguyên', data);
    this.name = 'NotFoundError';
  }
}

export class ValidationError extends ApiError {
  public errors: Record<string, string[]>;

  constructor(message: string, errors: Record<string, string[]> = {}) {
    super(422, message || 'Dữ liệu xác thực không hợp lệ', errors);
    this.name = 'ValidationError';
    this.errors = errors;
  }
}

export class InternalServerError extends ApiError {
  constructor(message: string, data: unknown = null) {
    super(500, message || 'Lỗi hệ thống từ phía server', data);
    this.name = 'InternalServerError';
  }
}
