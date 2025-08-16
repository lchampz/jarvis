import { Card, CardContent } from "@/components/ui/card";
import { Building2, DoorOpen, Users, Clock } from "lucide-react";
import type { IRoom } from "@/types/rooms.types";

interface StatsCardsProps {
    rooms: IRoom[];
}

export function StatsCards({ rooms }: StatsCardsProps) {
    const totalRooms = rooms.length;
    const availableRooms = rooms.filter(r => r.isAvailable).length;
    const totalVisitors = rooms.reduce((sum, room) => sum + room.visitors.length, 0);
    const lastUpdate = new Date().toLocaleTimeString();

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="bg-white border-l-4 border-l-blue-500">
                <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                        <Building2 className="w-6 h-6 text-blue-600" />
                        <div>
                            <p className="text-sm text-gray-600">Total de Salas</p>
                            <p className="text-2xl font-bold text-gray-900">{totalRooms}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-white border-l-4 border-l-green-500">
                <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                        <DoorOpen className="w-6 h-6 text-green-600" />
                        <div>
                            <p className="text-sm text-gray-600">Salas Disponíveis</p>
                            <p className="text-2xl font-bold text-gray-900">{availableRooms}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-white border-l-4 border-l-orange-500">
                <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                        <Users className="w-6 h-6 text-orange-600" />
                        <div>
                            <p className="text-sm text-gray-600">Total de Visitantes</p>
                            <p className="text-2xl font-bold text-gray-900">{totalVisitors}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-white border-l-4 border-l-purple-500">
                <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                        <Clock className="w-6 h-6 text-purple-600" />
                        <div>
                            <p className="text-sm text-gray-600">Última Atualização</p>
                            <p className="text-sm font-medium text-gray-900">{lastUpdate}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
} 