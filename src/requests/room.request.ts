import { api as apiInstance } from "@/lib/api";
import type { IResponse } from "@/types/api.types";
import type { ICreateRoom, IRoom, IUpdateRoom } from "@/types/rooms.types";

const api = apiInstance();

export const createRoom = async (body: ICreateRoom): Promise<IResponse<IRoom>> => {
    const response = await api.post<IRoom>("/rooms", body);
    return response;
}

export const updateRoom = async (id: string, body: IUpdateRoom) => {
    const response = await api.put(`/rooms/${id}`, body);
    return response;
}

export const deleteRoom = async (roomId: string) => {
    try {
        const response = await api.get<IResponse<IRoom>>(`/rooms/delete/${roomId}`, false);

        return response;
    } catch (error) {
        console.error("Erro na requisição:", error);
        throw error;
    }
};

export const getRoom = async (id: string) => {
    const response = await api.get(`/rooms/${id}`);
    return response;
}

export const getRooms = async (): Promise<IResponse<IRoom[]>> => {
    const response = await api.get<IRoom[]>("/rooms");
    return response;
}