import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoggedOut from "./components/LoggedOut.jsx";
import LoggedIn from "./components/LoggedIn.jsx";
import Library from "./components/Library.jsx";
import { AuthProvider } from "./hooks/auth.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <LoggedIn />
              </ProtectedRoute>
            }
          />

          <Route
            path="/Library"
            element={
              <ProtectedRoute>
                <Library />
              </ProtectedRoute>
            }
          />

          <Route path="/login" element={<LoggedOut />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
