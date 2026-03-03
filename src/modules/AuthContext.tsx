import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { websocketService } from "../services/websocket.service";

interface WsMessage {
  channel: string;
  body: unknown;
  time: string;
}

interface AuthContextValue {
  accessToken: string | null;
  isAuthenticated: boolean;
  wsMessages: WsMessage[];
  handleLoginSuccess: (accessToken: string) => void;
  handleLogout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(() =>
    localStorage.getItem("accessToken"),
  );
  const [wsMessages, setWsMessages] = useState<WsMessage[]>([]);

  const pushMessage = (channel: string, body: unknown) => {
    setWsMessages((prev) => [
      ...prev,
      { channel, body, time: new Date().toLocaleTimeString() },
    ]);
  };

  // On mount: reconnect websocket if token already exists in storage
  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      websocketService.connect(token, () => {
        websocketService.subscribe("/user/queue/notifications", (message) => {
          const body = JSON.parse(message.body);
          console.log("Notification:", body);
          pushMessage("notifications", body);
        });
      });
    }

    return () => {
      websocketService.disconnect();
    };
  }, []);

  const handleLoginSuccess = (token: string) => {
    localStorage.setItem("accessToken", token);
    setAccessToken(token);

    websocketService.connect(token, () => {
      websocketService.subscribe("/user/queue/notifications", (message) => {
        const body = JSON.parse(message.body);
        console.log("Notification:", body);
        pushMessage("notifications", body);
      });

      websocketService.subscribe("/user/queue/payment", (message) => {
        const body = JSON.parse(message.body);
        console.log("Payment success:", body);
        pushMessage("payment", body);
      });
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setAccessToken(null);
    setWsMessages([]);
    websocketService.disconnect();
  };

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        isAuthenticated: !!accessToken,
        wsMessages,
        handleLoginSuccess,
        handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}

export default AuthContext;
