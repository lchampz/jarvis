import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LogIn, LogOut, DoorOpen, DoorClosed, Users, Trash2, Settings } from "lucide-react";
import type { IRoom } from "@/types/rooms.types";

interface RoomCardProps {
    room: IRoom;
    userInRoom: boolean;
    canEnter: boolean;
    isLoading: boolean;
    isAdmin: boolean;
    onRoomClick: (room: IRoom) => void;
    onCheckIn: (room: IRoom) => void;
    onCheckOut: (room: IRoom) => void;
    onDeleteRoom: (room: IRoom) => void;
    onEditRoom: (room: IRoom) => void;
}

export function RoomCard({
    room,
    userInRoom,
    canEnter,
    isLoading,
    isAdmin,
    onRoomClick,
    onCheckIn,
    onCheckOut,
    onDeleteRoom,
    onEditRoom
}: RoomCardProps) {
    const getRoomStatus = (room: IRoom) => {
        if (room.visitors.length >= room.visitorsCapacity) {
            return { status: 'Lotada', color: 'destructive', icon: DoorClosed };
        }
        if (room.visitors.length > 0) {
            return { status: 'Ocupada', color: 'secondary', icon: Users };
        }
        return { status: 'Vazia', color: 'default', icon: DoorOpen };
    };

    const { status, color, icon: StatusIcon } = getRoomStatus(room);

    return (
        <Card
            className={`bg-white hover:shadow-lg transition-all duration-200 cursor-pointer ${userInRoom ? 'ring-2 ring-blue-500' : ''
                }`}
            onClick={() => onRoomClick(room)}
        >
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <CardTitle className="text-lg font-semibold text-gray-900">
                        {room.name}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                        <Badge variant={color as any} className="text-xs">
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {status}
                        </Badge>

                        {/* Botões de admin */}
                        {isAdmin && (
                            <div className="flex gap-1">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onEditRoom(room);
                                    }}
                                    className="h-6 w-6 p-0 hover:bg-gray-100"
                                >
                                    <Settings className="w-3 h-3" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDeleteRoom(room);
                                    }}
                                    className="h-6 w-6 p-0 hover:bg-red-50 text-red-600 hover:text-red-700"
                                >
                                    <Trash2 className="w-3 h-3" />
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Ocupação</span>
                        <span className="font-medium text-gray-900">
                            {room.visitors.length}/{room.visitorsCapacity > 0 ? room.visitorsCapacity : 0}
                        </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className={`h-2 rounded-full transition-all duration-300 ${room.visitors.length / room.visitorsCapacity > 0.8
                                ? 'bg-red-500'
                                : room.visitors.length / room.visitorsCapacity > 0.5
                                    ? 'bg-yellow-500'
                                    : 'bg-green-500'
                                }`}
                            style={{
                                width: `${Math.min(100, (room.visitors.length / room.visitorsCapacity) * 100)}%`
                            }}
                        />
                    </div>
                </div>

                {room.visitors.length > 0 && (
                    <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-700">Visitantes atuais:</p>
                        <div className="flex flex-wrap gap-1">
                            {room.visitors.slice(0, 3).map((visitor, index) => {
                                console.log('Visitor:', visitor, 'Type:', typeof visitor); ``
                                return (
                                    <Badge key={index} variant="outline" className="text-xs">
                                        {typeof visitor === 'string' ? visitor : visitor.name || 'Visitante'}
                                    </Badge>
                                );
                            })}
                            {room.visitors.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                    +{room.visitors.length - 3}
                                </Badge>
                            )}
                        </div>
                    </div>
                )}

                <div className="flex gap-2">
                    {userInRoom ? (
                        <Button
                            onClick={(e) => {
                                e.stopPropagation();
                                onCheckOut(room);
                            }}
                            disabled={isLoading}
                            variant="destructive"
                            size="sm"
                            className="flex-1"
                        >
                            <LogOut className="w-4 h-4 mr-2" />
                            Sair
                        </Button>
                    ) : (
                        <Button
                            onClick={(e) => {
                                e.stopPropagation();
                                onCheckIn(room);
                            }}
                            disabled={!canEnter || isLoading}
                            variant="default"
                            size="sm"
                            className="flex-1"
                        >
                            <LogIn className="w-4 h-4 mr-2" />
                            Entrar
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
} 