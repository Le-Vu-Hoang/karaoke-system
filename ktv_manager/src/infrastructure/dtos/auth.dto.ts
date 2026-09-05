//# User DTO for response
export interface UserDto {
  id: string;
  fullName: string;
  phoneNumber: string;
  email?: string;
  role: 'ADMIN' | 'STAFF';
  imageUrl?: string;
}

//# Login
export interface LoginCredentialsDto {
  phoneNumber: string;
  password: string;
}

export interface LoginResponseDto {
  data: UserDto;
}