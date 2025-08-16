import { useState, useEffect } from 'react';
import { toast } from "sonner";
import { useAuth } from '../stores/auth.store';
import type { ICreateRoom, IRoom } from '@/types/rooms.types';
import { AddRoomModal } from '@/components/Dashboard/AddRoomModal';
import { createRoom, getRooms, updateRoom, deleteRoom } from '@/requests/room.request';
import { useRoomsStore } from '@/stores/rooms.store';
import { checkIn, checkOut } from '@/requests/visitor.request';
import { createNewRoom } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../hooks/useSocket';
import { DashboardHeader } from '@/components/Dashboard/DashboardHeader';
import { SearchBar } from '@/components/Dashboard/SearchBar';
import { StatsCards } from '@/components/Dashboard/StatsCards';
import { RoomsGrid } from '@/components/Dashboard/RoomsGrid';
import { RoomDetailsModal } from '@/components/Dashboard/RoomDetailsModal';

export function Dashboard() {
    const { id, isAdmin, logout } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState<IRoom | null>(null);
    const { rooms, setRooms, addRoom, updateRoom: updateRoomStore } = useRoomsStore();
    const [isAddRoomModalOpen, setIsAddRoomModalOpen] = useState(false);
    const {
        joinRoom,
        leaveRoom,
        onRoomCreated,
        onRoomUpdate,
        onRoomDeleted,
        offRoomCreated,
        offRoomUpdate,
        cleanupAll
    } = useSocket();

    const navigate = useNavigate();

    useEffect(() => {
        const fetchRooms = async (retryCount = 0) => {
            try {
                setIsLoading(true);
                const response = await getRooms();
                if (response.status === 200) {
                    const rooms = response.data.map(room => createNewRoom(room as IRoom));
                    setRooms(rooms);
                } else {
                    throw new Error(`HTTP ${response.status}`);
                }

            } catch (error) {
                console.error(`Tentativa ${retryCount + 1} falhou:`, error);

                if (retryCount < 2) {
                    setTimeout(() => fetchRooms(retryCount + 1), 1000 * (retryCount + 1));
                    return;
                }

                toast.error('Não foi possível conectar com o servidor');
                setRooms([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchRooms();
    }, []);

    useEffect(() => {
        const handleRoomDeleted = (data: { room: IRoom }) => {
            setRooms(rooms.filter(r => r.id !== data.room.id));
        };

        const handleRoomCreated = (data: { room: IRoom }) => {
            addRoom(createNewRoom(data.room));
        };

        const handleRoomUpdate = (data: { room: IRoom & { visitorsCount: number } }) => {
            const roomUpdateData = {
                id: data.room.id,
                name: data.room.name,
                visitorsCount: data.room.visitorsCount,
                visitorsCapacity: data.room.visitorsCapacity,
                updatedAt: new Date()
            };

            updateRoomStore(createNewRoom(data.room));
            updateRoom(data.room.id, roomUpdateData);
        };

        onRoomDeleted(handleRoomDeleted);
        onRoomCreated(handleRoomCreated);
        onRoomUpdate(handleRoomUpdate);

        return () => {
            console.log(' Limpando listeners do Dashboard');
            offRoomCreated(handleRoomCreated);
            offRoomUpdate(handleRoomUpdate);
        };
    }, [onRoomCreated, onRoomUpdate, offRoomCreated, offRoomUpdate]);

    useEffect(() => {
        return () => {
            console.log('🧹 Dashboard desmontando - cleanup completo');
            cleanupAll();
        };
    }, [cleanupAll]);

    const filteredRooms = rooms.filter(room =>
        room.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const isUserInRoom = (roomId: string): boolean => {
        return rooms.some(room => room.id === roomId && room.visitors.some(visitor => visitor.id === id));
    };

    const handleCheckIn = async (room: IRoom) => {


        if (room.visitors.length >= room.visitorsCapacity) {
            toast.error('Sala está lotada');
            return;
        }

        setIsLoading(true);

        try {
            const response = await checkIn(room.id, id as string);
            if (response.status === 200) {
                joinRoom(room.id);

                toast.success(`Entrou na ${room.name}!`, {
                    description: `Ocupação: ${room.visitors.length + 1}/${room.visitorsCapacity}`
                });

                setSelectedRoom(room);
            }

        } catch (error) {
            toast.error('Erro ao entrar na sala', {
                description: 'Tente novamente em alguns instantes'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleCheckOut = async (room: IRoom) => {
        setIsLoading(true);

        try {
            await checkOut(id as string);
            leaveRoom(room.id, id as string);

            setRooms(rooms.map(r =>
                r.id === room.id
                    ? { ...r, visitors: r.visitors.filter(v => v.id !== id) }
                    : r
            )
            );

            toast.success(`Saiu da ${room.name}!`, {
                description: `Ocupação: ${Math.max(0, room.visitors.length - 1)}/${room.visitorsCapacity}`
            });

            setSelectedRoom(null);

        } catch (error) {
            toast.error('Erro ao sair da sala', {
                description: 'Tente novamente em alguns instantes'
            });
        } finally {
            setIsLoading(false);
        }
    };


    const handleCreateRoom = async (roomData: ICreateRoom) => {
        try {
            const response = await createRoom(roomData);
            if (response.status === 200) {
                addRoom(createNewRoom(response.data as IRoom));
                setIsAddRoomModalOpen(false);
            }
        } catch (_e) {
            toast.error('Erro ao criar sala', {
                description: 'Tente novamente em alguns instantes'
            });
        }
    }

    const handleLogout = () => {
        setRooms([]);
        setSelectedRoom(null);

        logout();

        navigate('/login');

        toast.success('Logout realizado com sucesso!');
    };

    const handleDeleteRoom = async (room: IRoom) => {
        if (room.visitors.length > 0) {
            toast.error('Não é possível excluir uma sala com visitantes');
            return;
        }
        if (!confirm(`Tem certeza que deseja excluir a sala "${room.name}"?`)) {
            return;
        }

        try {
            setIsLoading(true);

            const response = await deleteRoom(room.id);

            if (response.status === 204) {
                setRooms(rooms.filter(r => r.id !== room.id));

                toast.success(`Sala "${room.name}" excluída com sucesso!`);
            } else {
                throw new Error('Erro ao excluir sala');
            }
        } catch (error) {
            console.error('Erro ao excluir sala:', error);
            toast.error('Erro ao excluir sala. Tente novamente.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleEditRoom = (room: IRoom) => {
        toast.info('Funcionalidade de edição em desenvolvimento');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
            <div className="max-w-7xl mx-auto">
                <DashboardHeader
                    isAdmin={isAdmin}
                    onAddRoom={() => setIsAddRoomModalOpen(true)}
                    onLogout={handleLogout}
                    userName={`Visitante ${id}`}
                />

                <SearchBar
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                />

                <StatsCards rooms={rooms} />

                <RoomsGrid
                    rooms={rooms}
                    filteredRooms={filteredRooms}
                    userInRoom={isUserInRoom}
                    isLoading={isLoading}
                    isAdmin={isAdmin}
                    onRoomClick={setSelectedRoom}
                    onCheckIn={handleCheckIn}
                    onCheckOut={handleCheckOut}
                    onDeleteRoom={handleDeleteRoom}
                    onEditRoom={handleEditRoom}
                />

                <RoomDetailsModal
                    room={selectedRoom}
                    onClose={() => setSelectedRoom(null)}
                />

                <AddRoomModal
                    isOpen={isAddRoomModalOpen}
                    onClose={() => setIsAddRoomModalOpen(false)}
                    onAddRoom={handleCreateRoom}
                />
            </div>
        </div>
    );
}


