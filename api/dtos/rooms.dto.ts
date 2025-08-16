export interface AddRoomDTO {
    name: string;
    visitorsCapacity: number;
}

export interface UpdateRoomDTO {
    name?: string;
    visitorsCapacity?: number;
}
