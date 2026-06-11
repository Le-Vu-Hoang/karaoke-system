// import { NestFactory } from '@nestjs/core';
// import { AppModule } from '../../app.module';
// import { RoomService } from '../../modules/room/room.service';
// import { PricingService } from '../../modules/pricing/pricing.service';
// import * as fs from 'fs';
// import * as path from 'path';
//
// async function bootstrap() {
//   const app = await NestFactory.createApplicationContext(AppModule);
//
//   const roomService = app.get(RoomService);
//   const pricingService = app.get(PricingService);
//
//   const jsonPath = path.join(__dirname, 'seed-rooms.json');
//   const fileContent = fs.readFileSync(jsonPath, 'utf-8');
//   const roomTypesData = JSON.parse(fileContent);
//
//   console.log(`Bắt đầu seed dữ liệu...`);
//
//   for (const typeData of roomTypesData) {
//     try {
//       // 1. Tạo RoomType
//       const roomType = await roomService.createNewType({
//         name: typeData.name,
//         capacity: typeData.capacity,
//         basePricePerHour: typeData.basePricePerHour,
//         description: typeData.description,
//       });
//       console.log(`✅ Tạo RoomType thành công: ${roomType.name} (ID: ${roomType.id})`);
//
//       // 2. Tạo PriceRules cho RoomType đó
//       if (typeData.priceRules && typeData.priceRules.length > 0) {
//         for (const rule of typeData.priceRules) {
//           await pricingService.createRule({
//             roomTypeId: roomType.id,
//             dayOfWeek: rule.dayOfWeek,
//             startTime: rule.startTime,
//             endTime: rule.endTime,
//             pricePerHour: rule.pricePerHour,
//           });
//         }
//         console.log(`   ✅ Đã thêm ${typeData.priceRules.length} price rules.`);
//       }
//
//       // 3. Tạo các Rooms thuộc RoomType đó
//       if (typeData.rooms && typeData.rooms.length > 0) {
//         for (const room of typeData.rooms) {
//           await roomService.addNewRoom({
//             roomTypeId: roomType.id,
//             roomNumber: room.roomNumber,
//             status: room.status,
//           });
//           console.log(`   ✅ Tạo phòng thành công: ${room.roomNumber}`);
//         }
//       }
//
//     } catch (error) {
//       console.error(`❌ Lỗi khi xử lý dữ liệu cho loại phòng ${typeData.name}:`, error.message);
//     }
//   }
//
//   console.log('Quá trình seed hoàn tất!');
//   await app.close();
// }
//
// bootstrap();
