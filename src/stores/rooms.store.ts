import type { IRoomStore } from "@/types/rooms.types";
import { create } from "zustand";

export const useRoomsStore = create<IRoomStore>((set) => ({
    rooms: [],
    setRooms: (rooms) => set({ rooms }),
    addRoom: (room) => set((state) => ({ rooms: [...state.rooms, room] })),
    updateRoom: (room) => set((state) => ({ rooms: state.rooms.map((r) => r.id === room.id ? room : r) })),
}));
