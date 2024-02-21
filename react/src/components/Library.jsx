import { useAuth } from "../hooks/auth";

function Library() {
  const { user, session, signOut } = useAuth();

  return (
    <div>
      <button
        onClick={() => {
          console.log(user);
          signOut();
        }}
      >
        Log user info and sign out
      </button>
    </div>
  );
}

export default Library;
