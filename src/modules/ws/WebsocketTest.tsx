import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../AuthContext";
import LoginForm from "../auth/LoginForm";

interface LogEntry {
  time: string;
  type: "action" | "ws";
  channel?: string;
  text: string;
}

function WebsocketTest() {
  const {
    isAuthenticated,
    accessToken,
    wsMessages,
    handleLoginSuccess,
    handleLogout,
  } = useAuth();
  const [actionLogs, setActionLogs] = useState<LogEntry[]>([]);
  const logEndRef = useRef<HTMLDivElement>(null);

  // Merge wsMessages (from context) + actionLogs into one sorted list
  const wsEntries: LogEntry[] = wsMessages
    .slice()
    .reverse()
    .map((m) => ({
      time: m.time,
      type: "ws",
      channel: m.channel,
      text: JSON.stringify(m.body, null, 0),
    }));
  const allLogs = [...actionLogs, ...wsEntries].sort((a, b) =>
    a.time.localeCompare(b.time),
  );

  // Auto-scroll to bottom whenever log changes
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [allLogs.length]);

  const addLog = (text: string) => {
    setActionLogs((prev) => [
      ...prev,
      { time: new Date().toLocaleTimeString(), type: "action", text },
    ]);
  };

  const onLoginSuccess = (token: string) => {
    handleLoginSuccess(token);
    addLog("Login successful. WebSocket connecting...");
  };

  const onLogout = () => {
    handleLogout();
    addLog("Logged out. WebSocket disconnected.");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link
            to="/"
            className="inline-block bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded transition duration-200"
          >
            ← Back to Home
          </Link>
        </div>

        {/* Two-column layout */}
        <div className="flex gap-6">
          {/* Left: WS status & logs */}
          <div className="flex-1 bg-white rounded-lg shadow-lg p-6">
            <h1 className="text-2xl font-bold mb-4 text-gray-800">
              WebSocket Test
            </h1>

            {/* Connection Status */}
            <div className="flex items-center gap-2 mb-4">
              <span
                className={`w-3 h-3 rounded-full ${
                  isAuthenticated ? "bg-green-500" : "bg-red-400"
                }`}
              />
              <span className="text-sm text-gray-600">
                {isAuthenticated
                  ? "Authenticated — WebSocket active"
                  : "Not authenticated"}
              </span>
            </div>

            {/* Token preview */}
            {isAuthenticated && accessToken && (
              <div className="mb-4 p-3 bg-gray-50 rounded-md border border-gray-200">
                <p className="text-xs font-medium text-gray-500 mb-1">
                  Access Token
                </p>
                <p className="text-xs text-gray-700 break-all font-mono">
                  {accessToken.slice(0, 60)}...
                </p>
              </div>
            )}

            {/* Log output */}
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-600">Event Log</p>
                {allLogs.length > 0 && (
                  <button
                    onClick={() => setActionLogs([])}
                    className="text-xs text-gray-400 hover:text-gray-600 transition"
                  >
                    Clear
                  </button>
                )}
              </div>
              <div className="bg-gray-900 rounded-md p-4 h-64 overflow-y-auto font-mono text-xs space-y-1">
                {allLogs.length === 0 ? (
                  <span className="text-gray-500">No events yet...</span>
                ) : (
                  allLogs.map((entry, i) => (
                    <div key={i}>
                      <span className="text-yellow-400">[{entry.time}]</span>
                      {entry.type === "ws" ? (
                        <>
                          <span className="text-purple-400">
                            {" "}
                            [{entry.channel}]
                          </span>{" "}
                          <span className="text-green-300">{entry.text}</span>
                        </>
                      ) : (
                        <span className="text-blue-300"> {entry.text}</span>
                      )}
                    </div>
                  ))
                )}
                <div ref={logEndRef} />
              </div>
            </div>
          </div>

          {/* Right: Login / User info */}
          <div className="w-80">
            {!isAuthenticated ? (
              <LoginForm onLoginSuccess={onLoginSuccess} />
            ) : (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  Account
                </h2>
                <p className="text-sm text-gray-600 mb-6">
                  You are logged in and the WebSocket connection is active.
                </p>
                <button
                  onClick={onLogout}
                  className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-md transition duration-200"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default WebsocketTest;
