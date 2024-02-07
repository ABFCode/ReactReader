import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "../utils/supabaseClient";

function LoggedOut() {
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
