import type { IVisitor } from "./visitors.types";

export interface IRoom {
    id: string;
    name: string;

    visitors: IVisitor[];
    visitorsCapacity: number;
    isAvailable: boolean;

    createdAt: Date;
    updatedAt: Date;
}

export interface ICreateRoom {
    name: string;
    visitorsCapacity: number;
}

export interface IUpdateRoom {
    name?: string;
    visitorsCapacity?: number;
}

export interface IRoomStoreState {
    rooms: IRoom[];
}

export interface IRoomStoreActions {
    setRooms: (rooms: IRoom[]) => void;
    addRoom: (room: IRoom) => void;
    updateRoom: (room: IRoom) => void;
}

export type IRoomStore = IRoomStoreState & IRoomStoreActions;