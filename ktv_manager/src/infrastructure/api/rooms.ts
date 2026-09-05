import { apiClient } from "./http-client";

export const getLiveRooms = async (page = 1, limit = 50) => {
  const { data } = await apiClient.get(`/rooms?page=${page}&limit=${limit}`);
  return data; // Expected shape: { data: RoomLiveResponseDto[], meta: { ... } }
};
