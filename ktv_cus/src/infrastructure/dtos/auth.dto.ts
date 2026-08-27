export interface MembershipTierDto {
    id: string;
    name: string;
    discountPercent: number;
    minSpent: number;
    minPoints: number;
}

//# User DTO for response
export interface UserDto {
    id: string;
    fullName: string;
    phoneNumber: string;
    email?: string;
    role: 'CUSTOMER' | 'STAFF';
    imageUrl?: string;
    loyaltyPoints: number;
    totalSpent: number;
    membershipTier?: MembershipTierDto | null;
}

//# Login
export interface LoginCredentialsDto {
    phoneNumber: string;
    password: string;
}

export interface LoginResponseDto {
    data: UserDto;
}

//# Register
export interface RegisterCredentialsDto {
    fullname: string;
    email?: string;
    phone: string;
    password: string;
}

export interface RegisterResponseDto {
    data: UserDto;
}