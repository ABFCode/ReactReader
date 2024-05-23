import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoggedOut from "./components/LoggedOut.jsx";
import LoggedIn from "./components/LoggedIn.jsx";
import Library from "./components/Library.jsx";
import { AuthProvider } from "./hooks/auth.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";

function App() {
  return (
    <MantineProvider>
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
    </MantineProvider>
  );
}

export default App;
