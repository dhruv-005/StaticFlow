import { io, Socket } from "socket.io-client";

export class RealtimeChannel {
  private socket: Socket | null = null;
  private url: string;
  private token?: string;

  constructor(url: string, token?: string) {
    this.url = url;
    this.token = token;
  }

  public connect(): Socket {
    if (this.socket && this.socket.connected) {
      return this.socket;
    }

    this.socket = io(this.url, {
      transports: ["websocket", "polling"],
      auth: this.token ? { token: `Bearer ${this.token}` } : undefined,
    });

    return this.socket;
  }

  public subscribe<T = unknown>(channel: string, event: string, callback: (payload: T) => void): () => void {
    const socket = this.connect();
    socket.emit("join", channel);

    const handler = (data: { channel?: string; payload: T }) => {
      if (!data.channel || data.channel === channel) {
        callback(data.payload || (data as unknown as T));
      }
    };

    socket.on(event, handler);

    return () => {
      socket.off(event, handler);
      socket.emit("leave", channel);
    };
  }

  public broadcast(channel: string, event: string, data: unknown): void {
    const socket = this.connect();
    socket.emit("broadcast", { channel, event, data });
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}
