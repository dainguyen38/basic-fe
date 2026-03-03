import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Welcome to Basic FE
        </h1>

        <div className="space-y-4">
          <Link
            to="/websocket"
            className="block w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg text-center transition duration-200"
          >
            WebSocket Test
          </Link>

          <Link
            to="/chat"
            className="block w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg text-center transition duration-200"
          >
            Chat
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
