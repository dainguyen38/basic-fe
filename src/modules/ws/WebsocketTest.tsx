import { Link } from "react-router-dom";

function WebsocketTest() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link
            to="/"
            className="inline-block bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded transition duration-200"
          >
            ← Back to Home
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">
            WebSocket Test
          </h1>

          <div className="space-y-4">
            <p className="text-gray-600">
              WebSocket test component - Add your WebSocket implementation here.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WebsocketTest;
