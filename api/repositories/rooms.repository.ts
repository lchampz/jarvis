import type { Room } from "api/generated/prisma";
import prisma from "../database/prisma";
import { emitGlobalUpdate } from "../server";

export const createRoom = async (room: Omit<Room, "id" | "createdAt" | "updatedAt">) => {
    const newRoom = await prisma.room.create({
        data: {
            ...room,
        }
    });

    emitGlobalUpdate("room-created", {
        action: "created",
        room: newRoom,
        message: `Nova sala "${newRoom.name}" foi criada!`
    });

    return newRoom;
}

export const getRoomById = async (id: string) => {
    return prisma.room.findUnique({
        where: {
            id
        }
    });
}

export const getRooms = async () => {
    return prisma.room.findMany({
        include: {
            visitors: true
        }
    });
}

export const updateRoom = async (id: string, room: Room) => {
    const { createdAt, updatedAt, ...updateData } = room;

    return prisma.room.update({
        where: { id },
        data: {
            ...updateData,
            updatedAt: new Date()
        }
    });
}

export const updateRoomVisitorsCount = async (roomId: string, count: number) => {
    return prisma.room.update({
        where: { id: roomId },
        data: {
            visitorsCount: count,
            updatedAt: new Date()
        }
    });
}

export const getRoomWithVisitors = async (id: string) => {
    return prisma.room.findUnique({
        where: { id },
        include: {
            visitors: {
                select: {
                    id: true,
                    name: true,
                    email: true
                }
            }
        }
    });
}

export const deleteRoom = async (id: string) => {
    const room = await prisma.room.findUnique({
        where: { id },
        include: { visitors: true }
    });

    if (!room) {
        throw new Error('Sala não encontrada');
    }

    if (room.visitors.length > 0) {
        throw new Error('Não é possível excluir uma sala com visitantes');

    }

    const deletedRoom = await prisma.room.delete({
        where: { id }
    });

    emitGlobalUpdate("room-deleted", {
        action: "deleted",
        roomId: id,
        room: room
    });

    return deletedRoom;

}