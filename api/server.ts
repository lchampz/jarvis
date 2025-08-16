import { Elysia } from "elysia";
import { createServer } from "http";
import { Server } from "socket.io";
import { roomsRoute } from "./routes/rooms.route";
import { visitorsRoute } from "./routes/visitors.route";
import { authRoute } from "./routes/auth.route";
import type { RequestListener } from "http";
import cors from "@elysiajs/cors";

const app = new Elysia()
    .use(cors(
        {
            origin: [
                "http://localhost:3000",
                "http://localhost:5173",
                "http://localhost:3001"
            ],
            methods: ["GET", "POST", "PUT", "DELETE"],
        }
    ))
    .use(roomsRoute)
    .use(visitorsRoute)
    .use(authRoute);

const server = createServer(app.handle as unknown as RequestListener);

const io = new Server(server, {
    cors: {
        origin: [
            "http://localhost:3000",
            "http://localhost:5173",
            "http://localhost:3001"
        ],
        methods: ["GET", "POST", "PUT", "DELETE"],
    }
});

io.on("connection", (socket) => {
    console.log("🔌 Usuário conectado:", socket.id);

    socket.on("join-room", (roomId: string) => {
        socket.join(`room-${roomId}`);
        console.log(`👥 Usuário ${socket.id} entrou na sala ${roomId}`);
        emitGlobalUpdate("user-joined-room", {
            roomId,
            visitorId: socket.id,
        });
    });

    socket.on("leave-room", (roomId: string, visitorId: string) => {
        socket.leave(`room-${roomId}`);
        console.log(`👋 Usuário ${socket.id} saiu da sala ${roomId}`);

    });

    socket.on("disconnect", () => {
        console.log("❌ Usuário desconectado:", socket.id);
    });
});

export const emitRoomUpdate = (roomId: string, roomData: any) => {
    io.to(`room-${roomId}`).emit("room-updated", {
        roomId,
        data: roomData,
        timestamp: new Date()
    });
};

export const emitGlobalUpdate = (event: string, data: any) => {
    io.emit(event, {
        ...data,
        timestamp: new Date()
    });
};

server.listen(3002, () => {
    console.log("🔌 WebSocket server ready on port 3002");
});

app.listen(3001, () => {
    console.log("🔌 API server ready on port 3001");
});