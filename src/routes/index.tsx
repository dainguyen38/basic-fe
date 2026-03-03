import { createBrowserRouter, Navigate } from "react-router-dom";
import Home from "../modules/pages/Home";
import WebsocketTest from "../modules/ws/WebsocketTest";
import Chat from "../modules/chat/Chat";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/websocket",
    element: <WebsocketTest />,
  },
  {
    path: "/chat",
    element: <Chat />,
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);
