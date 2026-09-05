import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Danh sách các route public không cần đăng nhập
const publicRoutes = ["/login", "/auth/callback"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Giả sử Backend NestJS sẽ set HttpOnly cookie tên là 'access_token' khi login thành công
  // (Bạn có thể đổi tên cookie này cho khớp với backend của bạn)
  const token = request.cookies.get("access_token")?.value;

  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));

  // 1. Chưa đăng nhập mà vào trang nội bộ -> Đá ra /login
  if (!token && !isPublicRoute) {
    const loginUrl = new URL("/login", request.url);
    // Lưu lại URL cũ để đăng nhập xong quay lại (tuỳ chọn)
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 2. Đã đăng nhập mà cố vào lại trang /login -> Đá về Dashboard (/)
  if (token && pathname === "/login") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

// Cấu hình để middleware chỉ chạy trên các route nhất định (bỏ qua file tĩnh, API, ảnh)
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
