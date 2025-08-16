import { Building2 } from "lucide-react";
import { RoomCard } from "./RoomCard";
import type { IRoom } from "@/types/rooms.types";

interface RoomsGridProps {
    rooms: IRoom[];
    filteredRooms: IRoom[];
    isLoading: boolean;
    isAdmin: boolean;
    userInRoom: (roomId: string) => boolean;
    onRoomClick: (room: IRoom) => void;
    onCheckIn: (room: IRoom) => void;
    onCheckOut: (room: IRoom) => void;
    onDeleteRoom: (room: IRoom) => void;
    onEditRoom: (room: IRoom) => void;
}

export function RoomsGrid({
    rooms,
    filteredRooms,
    userInRoom,
    isLoading,
    isAdmin,
    onRoomClick,
    onCheckIn,
    onCheckOut,
    onDeleteRoom,
    onEditRoom
}: RoomsGridProps) {
    if (filteredRooms.length === 0) {
        return (
            <div className="text-center py-12">
                <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Nenhuma sala encontrada
                </h3>
                <p className="text-gray-600">
                    Tente ajustar os termos de busca ou verifique se há salas cadastradas.
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRooms.map((room) => {
                const userInThisRoom = userInRoom(room.id);
                const canEnter = room.isAvailable;

                return (
                    <RoomCard
                        key={room.id}
                        room={room}
                        userInRoom={userInThisRoom}
                        canEnter={canEnter}
                        isLoading={isLoading}
                        isAdmin={isAdmin}
                        onRoomClick={onRoomClick}
                        onCheckIn={onCheckIn}
                        onCheckOut={onCheckOut}
                        onDeleteRoom={onDeleteRoom}
                        onEditRoom={onEditRoom}
                    />
                );
            })}
        </div>
    );
} 