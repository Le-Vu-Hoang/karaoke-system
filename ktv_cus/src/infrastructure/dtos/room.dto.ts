export type RoomStatus = 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE';

export interface RoomType {
    id: string;
    name: string;
    capacity: number;
    basePricePerHour: number;
    description: string | null;
    imageUrl?: string | null;
    tags?: string[];
}

export interface Room {
    id: string;
    name: string;
    roomNumber: string;
    type: RoomType;
    capacity: number;
    pricePerHour: number;
    status: RoomStatus;
    description: string | null;
    imageUrl: string | null;
    isActive: boolean;
}

export interface GetRoomsQueryParams {
    type?: RoomType;
    status?: RoomStatus;
    limit?: number;
    page?: number;
}

