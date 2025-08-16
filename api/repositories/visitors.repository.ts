import type { Visitor } from "api/generated/prisma";
import prisma from "../database/prisma";
import type { AddVisitorDTO } from "api/dtos/visitors.dto";
import { VisitorActions } from "api/enum/actions";
import { emitRoomUpdate, emitGlobalUpdate } from "../server";

export const createVisitor = async (visitor: AddVisitorDTO) => {
    if (!visitor.name || !visitor.cpf || !visitor.email || !visitor.password) {
        throw new Error("Campos obrigatórios faltando");
    }

    const visitorExists = await prisma.visitor.findUnique({
        where: {
            cpf: visitor.cpf
        }
    });

    if (visitorExists) {
        throw new Error("CPF já cadastrado");
    }

    const emailExists = await prisma.visitor.findUnique({
        where: {
            email: visitor.email
        }
    });

    if (emailExists) {
        throw new Error("Email já cadastrado");
    }

    return prisma.visitor.create({
        data: {
            name: visitor.name,
            cpf: visitor.cpf,
            email: visitor.email,
            password: await Bun.password.hash(visitor.password)
        }
    });
}

export const getVisitorById = async (id: string) => {
    return prisma.visitor.findUnique({
        omit: {
            password: true
        },
        where: {
            id
        }
    });
}

export const getVisitors = async () => {
    return prisma.visitor.findMany({
        omit: {
            password: true
        }
    });
}

export const updateVisitor = async (id: string, visitor: Partial<Visitor>) => {
    return prisma.visitor.update({
        where: {
            id
        },
        data: visitor
    });
}

export const deleteVisitor = async (id: string) => {
    return prisma.visitor.delete({
        where: {
            id
        }
    });
}

export const checkInVisitor = async (visitorId: string, roomId: string) => {
    if (!visitorId || !roomId) {
        throw new Error('ID do visitante e ID da sala são obrigatórios');
    }

    console.log("🔍 CheckIn - visitorId:", visitorId, "roomId:", roomId);

    return await prisma.$transaction(async (tx) => {
        const room = await tx.room.findUnique({
            where: { id: roomId },
            select: {
                id: true,
                name: true,
                visitorsCount: true,
                visitorsCapacity: true
            }
        });

        if (!room) {
            throw new Error('Sala não encontrada');
        }

        if (room.visitorsCount >= room.visitorsCapacity) {
            throw new Error(`Sala ${room.name} está lotada (${room.visitorsCount}/${room.visitorsCapacity})`);
        }

        const visitor = await tx.visitor.findUnique({
            where: { id: visitorId },
            select: {
                id: true,
                roomId: true,
                name: true
            }
        });

        if (!visitor) {
            throw new Error('Visitante não encontrado');
        }

        if (visitor.roomId && visitor.roomId !== roomId) {
            await tx.room.update({
                where: { id: visitor.roomId },
                data: {
                    visitorsCount: {
                        decrement: 1
                    }
                }
            });
        }

        const updatedVisitor = await tx.visitor.update({
            where: { id: visitorId },
            data: { roomId }
        });

        await tx.room.update({
            where: { id: roomId },
            data: {
                visitorsCount: {
                    increment: 1
                }
            }
        });

        await tx.log.create({
            data: {
                visitorId,
                roomId,
                action: VisitorActions.CHECKIN,
                timestamp: new Date()
            }
        });

        const updatedRoom = await tx.room.findUnique({
            where: { id: roomId },
            include: {
                visitors: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        });

        emitGlobalUpdate("room-updated", {
            action: "checkin",
            roomId,
            visitorId,
            room: updatedRoom
        });

        return updatedVisitor;
    });
};

export const checkOutVisitor = async (visitorId: string) => {
    if (!visitorId) {
        throw new Error('ID do visitante é obrigatório');
    }

    console.log(" CheckOut - visitorId:", visitorId);

    return await prisma.$transaction(async (tx) => {
        const visitor = await tx.visitor.findUnique({
            where: { id: visitorId },
            select: {
                id: true,
                roomId: true,
                name: true
            }
        });

        if (!visitor) {
            throw new Error('Visitante não encontrado');
        }

        if (!visitor.roomId) {
            throw new Error('Visitante não está em nenhuma sala');
        }

        await tx.room.update({
            where: { id: visitor.roomId },
            data: {
                visitorsCount: {
                    decrement: 1
                }
            }
        });

        const updatedVisitor = await tx.visitor.update({
            where: { id: visitorId },
            data: { roomId: null }
        });

        if (visitor.roomId) {
            const updatedRoom = await tx.room.findUnique({
                where: { id: visitor.roomId },
                include: {
                    visitors: {
                        select: {
                            id: true,
                            name: true
                        }
                    }
                }
            });

            emitGlobalUpdate("room-updated", {
                action: "checkout",
                roomId: visitor.roomId,
                visitorId,
                room: updatedRoom
            });
        }

        await tx.log.create({
            data: {
                visitorId,
                roomId: visitor.roomId,
                action: VisitorActions.CHECKOUT,
                timestamp: new Date()
            }
        });

        return updatedVisitor;
    });
};

