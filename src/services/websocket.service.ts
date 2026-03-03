import { Client, type IMessage, type StompSubscription } from "@stomp/stompjs";
import SockJS from "sockjs-client";

class WebSocketService {
  private client: Client | null = null;
  private subscriptions: StompSubscription[] = [];

  connect(token: string, onConnected?: () => void) {
    if (this.client?.active) return;

    this.client = new Client({
      // SockJS requires an HTTP/HTTPS URL, not ws://
      webSocketFactory: () =>
        new SockJS(
          import.meta.env.VITE_WS_BASE_URL || "http://localhost:8080/ws",
        ),
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
      debug: (str) => {
        console.log("STOMP:", str);
      },
    });

    this.client.onConnect = () => {
      console.log("WebSocket connected");
      onConnected?.();
    };

    this.client.onStompError = (frame) => {
      console.error("Broker error:", frame.headers["message"]);
    };

    this.client.activate();
  }

  subscribe(destination: string, callback: (message: IMessage) => void) {
    if (!this.client || !this.client.connected) return;

    const subscription = this.client.subscribe(destination, callback);
    this.subscriptions.push(subscription);
  }

  disconnect() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.subscriptions = [];

    this.client?.deactivate();
    this.client = null;
  }
}

export const websocketService = new WebSocketService();
