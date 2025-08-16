import { Button } from "@/components/ui/button";
import { Building2, Plus, LogOut, User } from "lucide-react";
import type { UserType } from "@/types/userType.enum";

interface DashboardHeaderProps {
    isAdmin: boolean;
    onAddRoom: () => void;
    onLogout: () => void;
    userName?: string;
}

export function DashboardHeader({ isAdmin, onAddRoom, onLogout, userName }: DashboardHeaderProps) {
    return (
        <div className="mb-8">
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <Building2 className="w-8 h-8 text-blue-600" />
                        <h1 className="text-3xl font-bold text-gray-900">Dashboard de Salas</h1>
                    </div>
                    <p className="text-gray-600">
                        Gerencie suas salas e acompanhe a ocupação em tempo real
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    {/* Botão de adicionar sala (só para admin) */}
                    {isAdmin && (
                        <Button
                            onClick={onAddRoom}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Adicionar Sala
                        </Button>
                    )}

                    {/* Botão de usuário com dropdown */}
                    <div className="relative group">
                        <Button
                            variant="outline"
                            className="flex items-center gap-2 border-gray-200 hover:border-gray-300"
                        >
                            <User className="w-4 h-4" />
                            <span className="hidden sm:inline">
                                {userName || 'Usuário'}
                            </span>
                        </Button>

                        {/* Dropdown menu */}
                        <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                            <div className="p-2">
                                <div className="px-3 py-2 text-sm text-gray-600 border-b border-gray-100">
                                    <p className="font-medium">{userName || 'Usuário'}</p>
                                    <p className="text-xs text-gray-500">
                                        {isAdmin ? 'Administrador' : 'Visitante'}
                                    </p>
                                </div>

                                <div className="py-1">
                                    <button
                                        onClick={onLogout}
                                        className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md flex items-center gap-2"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        Sair
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 