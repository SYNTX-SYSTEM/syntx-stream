'use client';

import { useEffect, useRef, useState } from 'react';

export function useWebSocket(path: string) {
  const socketRef = useRef<WebSocket | null>(null);
  const [data, setData] = useState<any>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // WebSocket URL (später aktivieren)
    // const url = `wss://dev.syntx-system.com${path}`;
    // socketRef.current = new WebSocket(url);

    // socketRef.current.onopen = () => {
    //   setConnected(true);
    // };

    // socketRef.current.onmessage = (event) => {
    //   try {
    //     const msg = JSON.parse(event.data);
    //     setData(msg);
    //   } catch (e) {
    //     console.error('WebSocket parse error:', e);
    //   }
    // };

    // socketRef.current.onerror = (error) => {
    //   console.error('WebSocket error:', error);
    //   setConnected(false);
    // };

    // return () => {
    //   socketRef.current?.close();
    // };

    // Placeholder für jetzt
    console.log('WebSocket hook initialized for:', path);
  }, [path]);

  return { data, connected };
}
