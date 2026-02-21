import { useEffect, useRef, useCallback, useState } from 'react';

interface UseWebSocketOptions {
  url: string;
  onMessage?: (data: unknown) => void;
  autoReconnect?: boolean;
  reconnectInterval?: number;
}

export function useWebSocket({
  url,
  onMessage,
  autoReconnect = true,
  reconnectInterval = 3000,
}: UseWebSocketOptions) {
  const wsRef = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const connect = useCallback(() => {
    const ws = new WebSocket(url);

    ws.onopen = () => setIsConnected(true);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      onMessage?.(data);
    };

    ws.onclose = () => {
      setIsConnected(false);
      if (autoReconnect) {
        setTimeout(connect, reconnectInterval);
      }
    };

    ws.onerror = () => ws.close();

    wsRef.current = ws;
  }, [url, onMessage, autoReconnect, reconnectInterval]);

  useEffect(() => {
    connect();
    return () => wsRef.current?.close();
  }, [connect]);

  const send = useCallback((data: unknown) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(data));
    }
  }, []);

  return { isConnected, send };
}
