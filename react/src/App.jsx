import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import { Navigate } from "react-router-dom";
import { supabase } from "./utils/supabaseClient";
import { useState, useEffect } from "react";
import LoggedOut from "./components/LoggedOut.jsx";
import LoggedIn from "./components/LoggedIn.jsx";

function App() {
  // Contains the user received from Supabase
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Whenever the auth state changes, we receive an event and a session object.
    // Save the user from the session object to the state.
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN") {
        setUser(session?.user);
      }
    });
  }, []);

  return user ? <LoggedIn /> : <LoggedOut />;
}

export default App;
