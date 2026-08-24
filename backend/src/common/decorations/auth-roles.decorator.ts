import { applyDecorators } from '@nestjs/common';
import { Roles } from './role.decorator';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Role } from '@prisma/client';

/**
 * Custom decorator để kết hợp Guard phân quyền và hiển thị tài liệu Swagger.
 * Nó sẽ tự động thêm @ApiBearerAuth('JWT') và bổ sung yêu cầu phân quyền vào Description của API.
 */
export function AuthRoles(...roles: Role[]) {
  const rolesString = roles.join(', ');
  
  return function (target: any, propertyKey?: string, descriptor?: PropertyDescriptor) {
    // 1. Áp dụng Guard phân quyền
    Roles(...roles)(target, propertyKey as any, descriptor as any);
    
    // 2. Áp dụng Swagger Bearer Auth
    ApiBearerAuth('JWT')(target, propertyKey as any, descriptor as any);
    
    // 3. Nếu được gắn lên Method thì mới áp dụng ApiOperation
    if (descriptor) {
      ApiOperation({ 
        description: `🛡️ **Quyền truy cập yêu cầu:** \`${rolesString}\`` 
      })(target, propertyKey as any, descriptor as any);
    }
  };
}
