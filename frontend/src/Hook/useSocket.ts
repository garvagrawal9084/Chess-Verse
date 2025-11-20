import { useEffect, useState } from "react";

// Base URL for the WebSocket connection.
const WS_URL = "ws://localhost:8000/ws";

export const useSocket = () => {
  // Retrieve the token from localStorage.
  // Note: Use localStorage.getItem(), not localStorage.get().
  const token = localStorage.getItem("token");

  // State to hold the WebSocket instance.
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    // If no token exists, do not establish a connection.
    if (!token) {
      console.warn(
        "No token found, WebSocket connection will not be established."
      );
      return;
    }

    // Optionally, append the token as a query parameter.
    // This allows the server to authenticate the connection.
    const ws = new WebSocket(`${WS_URL}?token=${token}`);

    ws.onopen = () => {
      console.log("Connected to WebSocket");
      setSocket(ws);
    };

    ws.onclose = () => {
      console.log("Disconnected from WebSocket");
      setSocket(null);
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    // Cleanup function to close the connection when the component unmounts.
    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [token]); // Dependency on token so that if it changes, the connection is updated.

  return socket;
};
