import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import { Navigate } from "react-router-dom";
import { supabase } from "./utils/supabaseClient";
import { useState, useEffect } from "react";
import LoggedOut from "./components/LoggedOut.jsx";
import LoggedIn from "./components/LoggedIn.jsx";
import Library from "./components/Library.jsx";
import { AuthProvider } from "./hooks/auth.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

function App() {
  // Contains the user received from Supabase
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Whenever the auth state changes, we receive an event and a session object.
    // Save the user from the session object to the state.
    supabase.auth.onAuthStateChange((event, session) => {
      console.log(event, session);
      if (event === "SIGNED_IN") {
        setUser(session?.user);
      }
    });
  }, []);

  // return user ? <LoggedIn /> : <LoggedOut />;

  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={user ? <LoggedIn /> : <LoggedOut />} />

          <Route
            path="/Library"
            element={
              <ProtectedRoute>
                <Library />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
