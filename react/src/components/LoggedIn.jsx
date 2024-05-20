//import { useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";
import { useNavigate, Link } from "react-router-dom";

const supabaseProjectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;

function LoggedIn() {
  const navigate = useNavigate();
  // Store data that we get from the backend
  //const [ourSecretData, setOutSecretData] = useState();

  // Perform a request to the backend (with a protected route) to get the secret data
  // useEffect(() => {
  //   fetch("http://localhost:3000/secret", {
  //     method: "POST",
  //     headers: {
  //       // This is the token that we get from Supabase.
  //       Authorization: getToken(),
  //     },
  //   })
  //     .then((res) => res.json())
  //     .then((data) => setOutSecretData(data));
  // }, []);

  // This removes the token from local storage and reloads the page
  async function handleSignOut() {
    await supabase.auth.signOut();
    navigate("/");
  }

  return (
    //<div>{JSON.stringify(ourSecretData)}</div>
    <>
      <button onClick={handleSignOut}>Sign out</button>
      <Link to="/library">
        <button>Go to Library</button>
      </Link>
    </>
  );
}

// This function gets the token from local storage.
// Supabase stores the token in local storage so we can access it from there.
// const getToken = () => {
//   const storageKey = `sb-${supabaseProjectId}-auth-token`;
//   const sessionDataString = localStorage.getItem(storageKey);
//   const sessionData = JSON.parse(sessionDataString || "null");
//   const token = sessionData?.access_token;

//   return token;
// };

export default LoggedIn;
