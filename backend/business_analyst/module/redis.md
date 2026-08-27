# Tài Liệu Đặc Tả Module Redis (Cache)

## 1. Tổng Quan
Module `Redis` trong hệ thống được thiết kế để đóng vai trò như một bộ nhớ đệm (Cache) trung tâm, giúp tối ưu hóa hiệu năng bằng cách lưu trữ các dữ liệu thường xuyên được truy xuất, từ đó giảm tải cho Database chính (PostgreSQL/Prisma). 
Module này được triển khai dưới dạng **Dynamic Module** (mô-đun động) và được đánh dấu là **Global Module**, nghĩa là sau khi khởi tạo ở tầng `AppModule`, nó có thể được sử dụng ở bất kỳ đâu trong toàn bộ ứng dụng mà không cần import lại.

## 2. Kiến Trúc và Công Nghệ
- **Thư viện chính**: `@nestjs/cache-manager` kết hợp với `cache-manager-redis-yet`.
- **Cơ chế**: Sử dụng `cache-manager` chuẩn của NestJS để có một API giao tiếp đồng nhất (đồng thời có thể dễ dàng chuyển đổi sang bộ nhớ tạm khác nếu cần, mặc dù hiện tại đang dùng Redis).
- **Phạm vi**: Global Module.

## 3. Cấu trúc thư mục
```text
src/modules/redis/
├── interface/
│   └── redis-catch.interface.ts   # Định nghĩa kiểu dữ liệu cấu hình cho Redis (Host, Port, TTL...)
├── redis.module.ts                # Khai báo Dynamic Module và cấu hình kết nối Redis
└── redis.service.ts               # Các hàm tiện ích để giao tiếp với Redis (Get, Set, Delete, Reset, GetOrSet)
```

## 4. Chức Năng Cốt Lõi (RedisService)

Service `RedisService` cung cấp các phương thức đã được bọc lại (wrapper) từ `cacheManager`, giúp việc thao tác với Redis trở nên dễ dàng và tường minh hơn:

1. **`get<T>(key: string)`**: 
   - Lấy dữ liệu từ cache theo `key`. Trả về `null` nếu không tìm thấy.
   
2. **`set<T>(key: string, value: T, ttl?: number)`**: 
   - Lưu trữ dữ liệu vào cache. 
   - Tham số `ttl` (Time-To-Live - mili giây) dùng để xác định thời gian sống của dữ liệu. Nếu không truyền, nó sẽ sử dụng `ttl` mặc định được cấu hình khi khởi tạo module.

3. **`del(key: string)`**: 
   - Xóa một `key` cụ thể khỏi bộ nhớ đệm.

4. **`reset()`**: 
   - Xóa toàn bộ dữ liệu trong bộ nhớ đệm. Cần cực kỳ cẩn thận khi sử dụng hàm này trong môi trường production.

5. **`getOrSet<T>(key: string, fetcher: () => Promise<T>, ttl?: number)`**: 
   - Đây là một hàm cực kỳ hữu ích. Nó sẽ thử lấy dữ liệu từ cache theo `key`. 
   - Nếu tồn tại, nó trả về dữ liệu trong cache ngay lập tức.
   - Nếu KHÔNG tồn tại, nó sẽ thực thi hàm `fetcher` (thường là hàm query vào Database), sau đó lưu kết quả vào cache với thời gian `ttl` đã cho và trả về kết quả đó.

## 5. Cách Sử Dụng Trong Hệ Thống

Vì `RedisModule` là Global Module, ở các service khác (ví dụ: `BookingService`, `RoomService`), bạn chỉ cần Inject `RedisService` để sử dụng trực tiếp:

```typescript
import { Injectable } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class RoomService {
  constructor(
    private readonly redisService: RedisService,
    private readonly prisma: PrismaService,
  ) {}

  async getRoomDetails(roomId: string) {
    const cacheKey = `room_details_${roomId}`;

    // Tự động lấy từ cache, nếu không có sẽ query từ Prisma và tự động cache lại
    return this.redisService.getOrSet(
      cacheKey, 
      async () => {
        return this.prisma.room.findUnique({ where: { id: roomId } });
      },
      60000 // Cache sống trong 60 giây (60000ms)
    );
  }
}
```

## 6. Cấu Hình Đầu Vào
Khi ứng dụng khởi động (tại `AppModule`), Redis sẽ được nạp thông qua hàm `forRootAsync`. Các giá trị như `host`, `port` sẽ được lấy từ biến môi trường (Environment Variables) thông qua `ConfigService`.

- `REDIS_HOST`: Địa chỉ máy chủ Redis (mặc định: localhost)
- `REDIS_PORT`: Cổng máy chủ Redis (mặc định: 6379)
- `ttl`: Thời gian sống mặc định của Cache (hiện tại đang cấu hình mặc định là 300000ms = 5 phút).
