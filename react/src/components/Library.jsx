import { useEffect, useState } from "react";
import { useAuth } from "../hooks/auth";
import { supabase } from "../utils/supabaseClient";
import { Link } from "react-router-dom";

function Library() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth(); // Get the current user from your AuthContext

  // Fetch books for the logged-in user
  useEffect(() => {
    const fetchBooks = async () => {
      if (user) {
        const { data, error } = await supabase
          .from("books")
          .select("*")
          .eq("user_id", user.id);

        if (error) {
          console.error("Error feching books", error);
        } else {
          setBooks(data);
        }
      }
      setLoading(false);
    };

    fetchBooks();
  }, [user]);

  //Handle path selection for book
  const handleFileSelect = async (event) => {
    const file = event.target.files[0];

    if (file && user) {
      //Get file path
      const filePath = file.path;

      //store metadata in DB
      const { data, error } = await supabase
        .from("books")
        .insert([
          {
            user_id: user.id,
            title: file.name,
            author: "Unknown",
            filepath: filePath,
          },
        ])
        .select();
      if (error) {
        console.error("Error adding book:", error);
      } else {
        setBooks([...books, data[0]]);
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>; // Show a loading indicator while loading
  }

  return (
    <div>
      <h1>My Library</h1>

      <input type="file" onChange={handleFileSelect} />

      {books.map((book) => {
        console.log("Book ID:", book.id);
        return (
          <li key={book.id}>
            <strong>{book.title}</strong>
          </li>
        );
      })}

      <Link to="/">
        <button>Go to Home</button>
      </Link>
    </div>
  );
}

export default Library;
