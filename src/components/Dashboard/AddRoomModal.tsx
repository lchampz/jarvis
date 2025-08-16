import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Building2, Users, Save } from "lucide-react";
import { toast } from "sonner";
import type { ICreateRoom } from '@/types/rooms.types';

interface AddRoomModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAddRoom: (roomData: ICreateRoom) => Promise<void>;
}

export function AddRoomModal({ isOpen, onClose, onAddRoom }: AddRoomModalProps) {
    const [roomName, setRoomName] = useState('');
    const [visitorsCapacity, setCapacity] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!roomName.trim() || !visitorsCapacity.trim()) {
            toast.error('Preencha todos os campos');
            return;
        }

        const capacityNum = parseInt(visitorsCapacity);
        if (capacityNum <= 0 || capacityNum > 100) {
            toast.error('Capacidade deve ser entre 1 e 100 pessoas');
            return;
        }

        setIsLoading(true);
        try {
            await onAddRoom({
                name: roomName.trim(),
                visitorsCapacity: capacityNum
            });

            setRoomName('');
            setCapacity('');
            onClose();

            toast.success('Sala criada com sucesso!');
        } catch (error) {
            toast.error('Erro ao criar sala');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md bg-white">
                <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                            <Building2 className="w-5 h-5 text-blue-600" />
                            Adicionar Nova Sala
                        </CardTitle>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onClose}
                            className="h-8 w-8 p-0 hover:bg-gray-100"
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    </div>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">
                                Nome da Sala
                            </label>
                            <div className="relative">
                                <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <Input
                                    placeholder="Ex: Sala de Reunião A"
                                    value={roomName}
                                    onChange={(e) => setRoomName(e.target.value)}
                                    className="pl-10"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">
                                Capacidade
                            </label>
                            <div className="relative">
                                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <Input
                                    type="number"
                                    placeholder="Ex: 10"
                                    value={visitorsCapacity}
                                    onChange={(e) => setCapacity(e.target.value)}
                                    className="pl-10"
                                    min="1"
                                    max="100"
                                    required
                                />
                            </div>
                            <p className="text-xs text-gray-500">
                                Máximo de 100 pessoas por sala
                            </p>
                        </div>

                        <div className="flex gap-3 pt-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onClose}
                                className="flex-1"
                                disabled={isLoading}
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                disabled={isLoading || !roomName.trim() || !visitorsCapacity.trim()}
                                className="flex-1 bg-blue-600 hover:bg-blue-700"
                            >
                                {isLoading ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Criando...
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <Save className="w-4 h-4" />
                                        Criar Sala
                                    </div>
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
