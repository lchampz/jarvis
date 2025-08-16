import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import type { IRoom } from "@/types/rooms.types";

interface RoomDetailsModalProps {
    room: IRoom | null;
    onClose: () => void;
}

export function RoomDetailsModal({ room, onClose }: RoomDetailsModalProps) {
    if (!room) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-blue-600" />
                        {room.name}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-gray-600">
                        Ocupação atual: {room.visitors.length}/{room.visitorsCapacity}
                    </p>
                    <div className="flex gap-2">
                        <Button
                            onClick={onClose}
                            variant="outline"
                            className="flex-1"
                        >
                            Fechar
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
} 