import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { PaginationQueryDto } from '../../common/dto/pagination.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { CreateServiceCategoryDto } from './dto/create-service-category.dto';
import { UpdateServiceCategoryDto } from './dto/update-service-category.dto';

@Injectable()
export class ServicesService {
  constructor(private readonly prisma: PrismaService) {}

  async createService(dto: CreateServiceDto) {
    const categoryExists = await this.prisma.serviceCategory.findUnique({
      where: { id: dto.categoryId },
    });

    if (!categoryExists) {
      throw new NotFoundException('Category not found!');
    }

    return await this.prisma.service.create({
      data: dto,
      include: { category: true },
    });
  }

  async getAllServices(query: PaginationQueryDto) {
    const page = query.page ? Number(query.page) : 1;
    const limit = query.limit ? Number(query.limit) : undefined;
    const skip = limit ? (page - 1) * limit : undefined;

    const [data, total] = await Promise.all([
      this.prisma.service.findMany({
        skip,
        take: limit,
        where: { isActive: true },
        orderBy: { name: 'asc' },
        include: { category: true },
      }),
      this.prisma.service.count({ where: { isActive: true } }),
    ]);

    const effectiveLimit = limit || total || 1;
    const lastPage = Math.ceil(total / effectiveLimit);

    return {
      data: data,
      meta: {
        total,
        page,
        limit: limit || total,
        lastPage,
        hasNextPage: page < lastPage,
        hasPreviousPage: page > 1,
      },
    };
  }

  async updateService(id: string, dto: UpdateServiceDto) {
    await this.checkServiceExist(id);

    if (dto.categoryId) {
      const categoryExists = await this.prisma.serviceCategory.findUnique({
        where: { id: dto.categoryId },
      });
      if (!categoryExists) throw new NotFoundException('Category not found!');
    }

    return await this.prisma.service.update({
      where: { id },
      data: dto,
      include: { category: true },
    });
  }

  async deleteService(id: string) {
    await this.checkServiceExist(id);

    await this.prisma.service.update({
      where: { id },
      data: { isActive: false },
    });

    return { message: 'Service disabled successfully!' };
  }

  //# --- Category Logic ---
  async createCategory(dto: CreateServiceCategoryDto) {
    return await this.prisma.serviceCategory.create({
      data: dto,
    });
  }

  async getAllCategories() {
    return await this.prisma.serviceCategory.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: 'asc' },
    });
  }

  async updateCategory(id: string, dto: UpdateServiceCategoryDto) {
    const category = await this.prisma.serviceCategory.findUnique({ where: { id } });
    if (!category) throw new NotFoundException('Category not found!');

    return await this.prisma.serviceCategory.update({
      where: { id },
      data: dto,
    });
  }

  async deleteCategory(id: string) {
    const category = await this.prisma.serviceCategory.findUnique({ where: { id } });
    if (!category) throw new NotFoundException('Category not found!');

    await this.prisma.serviceCategory.update({
      where: { id },
      data: { isActive: false },
    });

    return { message: 'Category disabled successfully!' };
  }

  //# --- Hàm Helper ---
  private async checkServiceExist(id: string) {
    const service = await this.prisma.service.findUnique({
      where: { id },
    });
    if (!service || !service.isActive) {
      throw new NotFoundException(`Service not found with ID: ${id}`);
    }
    return service;
  }
}
