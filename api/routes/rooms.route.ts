import { createRoom, deleteRoom, getRoomById, getRooms, updateRoom } from "../repositories/rooms.repository";
import type { ICreateRoom } from "@/types/rooms.types";
import prisma from "api/database/prisma";
import { Elysia } from "elysia";

export const roomsRoute = new Elysia()
    .get("/rooms", async ({ set }) => {
        const rooms = await getRooms();
        return {
            status: 200,
            data: rooms
        };
    })
    .get("/rooms/:id", async ({ params, set }) => {
        const room = await getRoomById(params.id);
        set.status = 200;
        return room;
    })
    .post("/rooms", async ({ body, set }) => {
        try {
            const parsedBody = JSON.parse(body);
            const roomData: ICreateRoom & { visitorsCount: number } = {
                name: parsedBody.name,
                visitorsCapacity: parsedBody.visitorsCapacity ?? parsedBody.capacity,
                visitorsCount: 0,
            };

            if (!roomData.name || !roomData.visitorsCapacity) {
                set.status = 400;
                return {
                    success: false,
                    status: 400,
                    message: "Nome e capacidade são obrigatórios"
                };
            }

            const createdRoom = await createRoom(roomData);

            set.status = 201;
            return ({
                success: true,
                status: 201,
                message: "Room created successfully",
                data: createdRoom
            });
        } catch (error) {
            console.error("Erro:", error);
            set.status = 400;
            return ({
                success: false,
                status: 400,
                message: "Error creating room",
                error: error instanceof Error ? error.message : "Erro desconhecido"
            });
        }
    })
    .put("/rooms/:id", async ({ params, body, set }) => {
        const parsedBody = JSON.parse(body);
        const room = await updateRoom(params.id, parsedBody);
        set.status = 200;
        return room;
    })
    .get("/rooms/delete/:id", async ({ params, set }) => {
        try {
            await deleteLog(params.id);
            const room = await deleteRoom(params.id);
            set.status = 204;
            return ({
                success: true,
                status: 204,
                message: "Room deleted successfully",
                data: room
            });
        } catch (error) {
            set.status = 400;
            return ({
                success: false,
                status: 400,
                message: "Error deleting room",
                error: error instanceof Error ? error.message : "Erro desconhecido"
            });
        }
    });

const deleteLog = async (id: string) => {
    const log = await prisma.log.deleteMany({
        where: { roomId: id }
    });
    return log;
}


