import type { IRoom } from "@/types/rooms.types";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function createNewRoom(roomData: IRoom): IRoom {
  return {
    id: roomData.id,
    name: roomData.name,
    visitors: roomData.visitors ?? [],
    visitorsCapacity: roomData.visitorsCapacity,
    createdAt: roomData.createdAt,
    updatedAt: roomData.updatedAt,
    get isAvailable() {
      return this.visitors.length < this.visitorsCapacity;
    }
  }
}