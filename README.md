## Description

### 🎤 K-Master: Next-Gen Karaoke Management System (2026)K-Master:
    là một hệ sinh thái quản lý Karaoke toàn diện, được thiết kế để số hóa toàn bộ quy trình vận hành từ đặt phòng đến quản lý kho hàng và dịch vụ tại bàn theo thời gian thực. Dự án áp dụng các tiêu chuẩn công nghiệp hiện đại nhất của năm 2026, sẵn sàng cho môi trường thực tế và có khả năng mở rộng cao.

### ✨ Tính Năng Nổi Bật (Core Features)

    - 📅 Smart Booking: Giao diện Next.js trực quan cho phép khách hàng chủ động chọn phòng, khung giờ và loại dịch vụ (VIP/Thường).
    - ⚡ Real-time Confirmation: Xử lý thông báo và đồng bộ trạng thái đặt lịch tức thì, đảm bảo không trùng phòng.
    - 🍹 In-Room Services: Menu điện tử tại bàn, dữ liệu gọi món được đồng bộ trực tiếp xuống bộ phận bếp/quầy bar.
    - 🖥️ Room Management: Quản lý trạng thái phòng (Trống/Đang hát/Chờ dọn dẹp) theo sơ đồ thực tế của quán.
    - 📦 Inventory Control: Tự động trừ tồn kho khi sử dụng dịch vụ và cảnh báo hàng hóa sắp hết thông qua Prisma ORM.
    - 🔐 Enterprise Security: Bảo mật tuyệt đối với cơ chế JWT (Access & Refresh Token) và phân quyền Admin/Staff chặt chẽ.

### Hệ Sinh Thái Công Nghệ (Tech Stack)

#### Backend (NestJS)
    - Framework: NestJS - Kiến trúc Module, Controller và Service chuẩn chỉnh.
    - ORM & DB: Prisma + PostgreSQL - Quản lý dữ liệu an toàn, hiệu suất cao.
    - Security: Passport.js & JWT Integration.
    - Documentation: Swagger API tự động hóa tài liệu cho các nhà phát triển.
#### Frontend (Next.js)
    - Core: Next.js & React - Giao diện mượt mà, tối ưu SEO.
    - Styling: Sass - Quản lý mã nguồn CSS chuyên nghiệp.
#### DevOps & ProductionContainer: 
    - Docker hóa toàn bộ ứng dụng để đảm bảo tính nhất quán.
    - Cloud: Triển khai trên...

### 🏗 Kiến Trúc Dự Án (Architecture)
```bash
    src/
    ├── modules/
    │   ├── auth/          # Xử lý đăng nhập, JWT, phân quyền
    │   ├── booking/       # Logic đặt lịch & kiểm tra phòng trống
    │   ├── services/      # Quản lý Menu & dịch vụ tại phòng
    │   ├── inventory/     # Quản lý kho hàng & lịch sử xuất nhập
    │   └── rooms/         # Tích hợp sơ đồ bàn & trạng thái phòng
    ├── common/            # Decorators, Guards, Interceptors dùng chung
    └── prisma/            # Schema database & migrations
```    

## Project setup

### Yêu cầu hệ thống
    Node.js (Version 25 trở lên).
    Docker (Để chạy PostgreSQL).

```bash
$ pnpm install
```

## Compile and run the project

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Run tests

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ pnpm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).