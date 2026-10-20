"use client";

import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

export function useRealtime(
  channel: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onEvent: (event: string, data: any) => void
) {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:8000", {
      transports: ["websocket"],
    });
    socketRef.current = socket;

    socket.emit("join-channel", channel);

    socket.onAny((event, data) => {
      onEvent(event, data);
    });

    return () => {
      socket.disconnect();
    };
  }, [channel, onEvent]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const emit = (event: string, payload: any) => {
    if (socketRef.current) {
      socketRef.current.emit(event, { channel, ...payload });
    }
  };

  return { emit };
}
