import { useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

export const useSocket = () => {
    const socketRef = useRef<Socket | null>(null);
    const isConnectedRef = useRef(false);
    const listenersRef = useRef<Map<string, Function>>(new Map());

    useEffect(() => {
        if (isConnectedRef.current) {
            return;
        }

        socketRef.current = io('http://localhost:3002', {
            transports: ['websocket', 'polling'],
            timeout: 20000,
        });

        socketRef.current.on('connect', () => {
            console.log('🔌 Conectado ao servidor WebSocket');
            isConnectedRef.current = true;
        });

        socketRef.current.on('disconnect', () => {
            console.log('❌ Desconectado do servidor WebSocket');
            isConnectedRef.current = false;
        });

        return () => {
            if (socketRef.current) {
                listenersRef.current.forEach((callback, event) => {
                    socketRef.current?.off(event, callback as (...args: any[]) => void);
                });
                listenersRef.current.clear();

                socketRef.current.disconnect();
                isConnectedRef.current = false;
            }
        };
    }, []);


    const joinRoom = useCallback((roomId: string) => {
        if (socketRef.current) {
            socketRef.current.emit('join-room', roomId);
        }
    }, []);

    const leaveRoom = useCallback((roomId: string, visitorId: string) => {
        if (socketRef.current) {
            socketRef.current.emit('leave-room', roomId, visitorId);
        }
    }, []);

    const offRoomCreated = useCallback((callback: (...args: any[]) => void) => {
        if (socketRef.current) {
            socketRef.current.off('room-created', callback);
            listenersRef.current.delete('room-created');
        }
    }, []);

    const offRoomUpdate = useCallback((callback: (...args: any[]) => void) => {
        if (socketRef.current) {
            socketRef.current.off('room-updated', callback);
            listenersRef.current.delete('room-updated');
        }
    }, []);

    const offGlobalUpdate = useCallback((callback: (...args: any[]) => void) => {
        if (socketRef.current) {
            socketRef.current.off('visitor-checked-in', callback);
            socketRef.current.off('visitor-checked-out', callback);
            listenersRef.current.delete('visitor-checked-in');
            listenersRef.current.delete('visitor-checked-out');
        }
    }, []);

    const onRoomCreated = useCallback((callback: (data: any) => void) => {
        if (socketRef.current) {
            socketRef.current.off('room-created');

            socketRef.current.on('room-created', callback);

            listenersRef.current.set('room-created', callback);
        }
    }, []);

    const onRoomUpdate = useCallback((callback: (data: any) => void) => {
        if (socketRef.current) {
            socketRef.current.off('room-updated');

            socketRef.current.on('room-updated', callback);

            listenersRef.current.set('room-updated', callback);
        }
    }, []);

    const onGlobalUpdate = useCallback((callback: (data: any) => void) => {
        if (socketRef.current) {
            socketRef.current.off('visitor-checked-in');
            socketRef.current.off('visitor-checked-out');

            socketRef.current.on('visitor-checked-in', callback);
            socketRef.current.on('visitor-checked-out', callback);

            listenersRef.current.set('visitor-checked-in', callback);
            listenersRef.current.set('visitor-checked-out', callback);
        }
    }, []);

    const onRoomDeleted = useCallback((callback: (data: any) => void) => {

        if (socketRef.current) {
            socketRef.current.off('room-deleted');

            socketRef.current.on('room-deleted', callback);

            listenersRef.current.set('room-deleted', callback);
        }
    }, []);

    const cleanupAll = useCallback(() => {
        if (socketRef.current) {
            listenersRef.current.forEach((callback, event) => {
                socketRef.current?.off(event, callback as (...args: any[]) => void);
            });
            listenersRef.current.clear();
        }
    }, []);

    return {
        socket: socketRef.current,
        joinRoom,
        leaveRoom,
        onRoomCreated,
        onRoomUpdate,
        onGlobalUpdate,
        onRoomDeleted,
        offRoomCreated,
        offRoomUpdate,
        offGlobalUpdate,
        cleanupAll
    };
};
