import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { AuthProvider } from "./modules/AuthContext";

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
