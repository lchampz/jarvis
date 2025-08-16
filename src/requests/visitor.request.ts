import { api } from "@/lib/api";

const apiInstance = api();

export const checkIn = async (roomId: string, visitorId: string) => {
    const response = await apiInstance.post(`/visitors/${visitorId}/check-in`, { roomId });
    return response;
}

export const checkOut = async (visitorId: string) => {
    const response = await apiInstance.get(`/visitors/${visitorId}/check-out`);
    return response;
}