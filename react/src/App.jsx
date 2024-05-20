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
  const [session, setSession] = useState(null);

  useEffect(() => {
    // Check for an active session on mount
    const fetchInitialSession = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        console.error("Error fetching initial session:", error);
      } else {
        setSession(session);
        console.log("Initial Session:", session);
      }
    };

    fetchInitialSession(); // Call the async function

    // Subscribe to auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event) => {
        // Get the updated session after an auth state change
        const {
          data: { session: updatedSession },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error("Error fetching updated session:", error);
        } else {
          setSession(updatedSession);
          console.log("Auth State Changed:", event, updatedSession);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);
  // return user ? <LoggedIn /> : <LoggedOut />;

  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={session ? <LoggedIn /> : <LoggedOut />} />

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
