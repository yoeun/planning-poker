import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { SessionData } from '../types';
import { UserData } from '../utils/storage';

const API_URL = import.meta.env.VITE_API_URL || (window.location.origin.includes('localhost') ? 'http://localhost:3001' : window.location.origin);

interface UseSessionSocketOptions {
  sessionId: string | undefined;
  userData: UserData | null;
  onSessionUpdate: (data: SessionData) => void;
  onSessionEnded: () => void;
  onError: (message: string) => void;
  enabled?: boolean;
}

interface UseSessionSocketReturn {
  socket: Socket | null;
  emitUpdateUser: (name: string, email: string, color?: string) => void;
  emitMakeChoice: (choice: string) => void;
  emitRevealChoices: () => void;
  emitResetSession: () => void;
  disconnect: () => void;
  isConnected: boolean;
}

export function useSessionSocket({
  sessionId,
  userData,
  onSessionUpdate,
  onSessionEnded,
  onError,
  enabled = true,
}: UseSessionSocketOptions): UseSessionSocketReturn {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  // Use refs for callbacks to avoid dependency issues
  const onSessionUpdateRef = useRef(onSessionUpdate);
  const onSessionEndedRef = useRef(onSessionEnded);
  const onErrorRef = useRef(onError);

  useEffect(() => {
    onSessionUpdateRef.current = onSessionUpdate;
    onSessionEndedRef.current = onSessionEnded;
    onErrorRef.current = onError;
  }, [onSessionUpdate, onSessionEnded, onError]);

  // Emit functions
  const emitUpdateUser = useCallback(
    (name: string, email: string, color?: string) => {
      if (!socket || !sessionId || !userData) return;

      socket.emit('updateUser', {
        sessionId,
        userId: userData.userId,
        name: name.trim(),
        email: email.trim(),
        color: color || undefined,
      });
    },
    [socket, sessionId, userData]
  );

  const emitMakeChoice = useCallback(
    (choice: string) => {
      if (!socket || !sessionId || !userData) return;

      socket.emit('makeChoice', {
        sessionId,
        userId: userData.userId,
        choice,
      });
    },
    [socket, sessionId, userData]
  );

  const emitRevealChoices = useCallback(() => {
    if (!socket || !sessionId) return;
    socket.emit('revealChoices', { sessionId });
  }, [socket, sessionId]);

  const emitResetSession = useCallback(() => {
    if (!socket || !sessionId) return;
    socket.emit('resetSession', { sessionId });
  }, [socket, sessionId]);

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
      setSocket(null);
      setIsConnected(false);
    }
  }, []);

  // Connect when sessionId or userData changes
  useEffect(() => {
    if (!enabled || !sessionId || !userData) {
      return;
    }

    // Clean up any existing socket connection
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }

    const newSocket = io(API_URL);
    socketRef.current = newSocket;
    setSocket(newSocket);

    newSocket.on('connect', () => {
      setIsConnected(true);
      newSocket.emit('joinSession', {
        sessionId,
        userId: userData.userId,
        name: userData.name,
        email: userData.email,
        color: userData.color,
      });
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
    });

    newSocket.on('sessionUpdate', (data: SessionData) => {
      onSessionUpdateRef.current(data);
    });

    newSocket.on('userJoined', () => {
      // Session will be updated via sessionUpdate
    });

    newSocket.on('userUpdated', () => {
      // Session will be updated via sessionUpdate
    });

    newSocket.on('choiceMade', () => {
      // Session will be updated via sessionUpdate
    });

    newSocket.on('revealChoices', (data: SessionData) => {
      onSessionUpdateRef.current(data);
    });

    newSocket.on('sessionReset', (data: SessionData) => {
      onSessionUpdateRef.current(data);
    });

    newSocket.on('sessionDeleted', () => {
      onSessionEndedRef.current();
    });

    newSocket.on('error', (data: { message: string }) => {
      onErrorRef.current(data.message);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setSocket(null);
        setIsConnected(false);
      }
    };
  }, [sessionId, userData, enabled]);

  return {
    socket,
    emitUpdateUser,
    emitMakeChoice,
    emitRevealChoices,
    emitResetSession,
    disconnect,
    isConnected,
  };
}

