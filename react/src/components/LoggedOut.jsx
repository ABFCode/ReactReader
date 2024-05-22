import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "../utils/supabaseClient";
import { useAuth } from "../hooks/auth";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

function LoggedOut() {
  const { session } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (session) {
      navigate("/");
    }
  }, [session, navigate]);

  return (
    <Auth
      supabaseClient={supabase}
      appearance={{
        theme: ThemeSupa,
      }}
      providers={[]}
      theme="dark"
      redirectTo="/"
      showLinks
    />
  );
}

export default LoggedOut;
