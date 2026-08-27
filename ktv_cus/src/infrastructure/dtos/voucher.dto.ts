export interface BaseVoucherDto {
  id: string;
  code: string;
  title: string;
  description: string | null;
  discountType: 'PERCENTAGE' | 'FIXED_AMOUNT';
  discountValue: number;
  maxDiscount: number | null;
  minOrderValue: number | null;
  scope: string;
  pointsCost: number;
  validFrom: string;
  validTo: string;
  isActive: boolean;
}

export interface UserVoucherDto {
  id: string;
  status: 'UNUSED' | 'USED' | 'EXPIRED';
  usedAt: string | null;
  createdAt: string;
  voucher: BaseVoucherDto;
}
