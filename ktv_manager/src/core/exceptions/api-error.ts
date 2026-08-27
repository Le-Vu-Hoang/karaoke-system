export class ApiError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
    public readonly data?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}
export class BadRequestError extends ApiError {
  constructor(message: string, data?: unknown) {
    super(400, message || "Yêu cầu không hợp lệ.", data);
    this.name = "BadRequestError";
  }
}
export class UnauthorizedError extends ApiError {
  constructor(message: string, data?: unknown) {
    super(401, message || "Phiên đăng nhập hết hạn.", data);
    this.name = "UnauthorizedError";
  }
}
export class ForbiddenError extends ApiError {
  constructor(message: string, data?: unknown) {
    super(403, message || "Bạn không có quyền truy cập.", data);
    this.name = "ForbiddenError";
  }
}
export class NotFoundError extends ApiError {
  constructor(message: string, data?: unknown) {
    super(404, message || "Không tìm thấy dữ liệu.", data);
    this.name = "NotFoundError";
  }
}
export class InternalServerError extends ApiError {
  constructor(message: string, data?: unknown) {
    super(500, message || "Lỗi máy chủ nội bộ.", data);
    this.name = "InternalServerError";
  }
}
