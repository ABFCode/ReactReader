//import { useState, useEffect } from "react";
//import { supabase } from "../utils/supabaseClient";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/auth";

//const supabaseProjectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;

function LoggedIn() {
  const { signOut, session } = useAuth();
  const navigate = useNavigate();
  async function handleSignOut() {
    try {
      console.log("Awaiting Signout");
      console.log("Current Session", session);
      await signOut();
      console.log("Finished Awaiting");
      navigate("/");
    } catch (error) {
      console.log("Failed to signout:", error);
    }
  }

  function printSession() {
    console.log(session);
  }

  return (
    <>
      <h1>Welcome, {session?.user?.email}</h1>
      <button onClick={handleSignOut}>Sign out</button>
      <Link to="/library">
        <button>Go to Library</button>
      </Link>
      <button onClick={printSession}>Print Session</button>
    </>
  );
}

export default LoggedIn;
