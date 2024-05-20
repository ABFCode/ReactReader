import { useEffect, useState } from "react";
import { useAuth } from "../hooks/auth";
import { supabase } from "../utils/supabaseClient";

function Library() {
  const [words, setWords] = useState([]);
  const [newWord, setNewWord] = useState("");
  const { user } = useAuth(); // Get the current user from your AuthContext

  // Fetch words for the logged-in user
  useEffect(() => {
    const fetchWords = async () => {
      if (user) {
        const { data, error } = await supabase
          .from("Words")
          .select("*")
          .eq("user_id", user.id);

        if (error) {
          console.error("Error fetching words:", error);
        } else {
          setWords(data);
        }
      }
    };

    fetchWords();
  }, [user]);

  // Handle adding a new word
  const handleAddWord = async () => {
    if (user && newWord.trim()) {
      const { data, error } = await supabase
        .from("Words")
        .insert([{ user_id: user.id, words: newWord.trim() }])
        .select();

      console.log("Data:", data);
      if (error) {
        console.error("Error adding word:", error);
      } else {
        // Assuming `data` is an array and you want to add all new words
        // directly to the `words` array in your state:
        if (Array.isArray(data) && data.length > 0) {
          setWords([...words, ...data]);
          console.log("It is an array!");
        } else if (data) {
          // If `data` is a single object, not an array:
          setWords([...words, data]);
          console.log("It's not an array!");
        }
        setNewWord(""); // Clear the input field
      }
    }

    // This seems like a separate fetch operation; consider moving it out
    // or ensuring it's only called when necessary.
    const { data, error } = await supabase
      .from("Words")
      .select("*")
      .eq("user_id", user.id);

    console.log("Supabase response:", { data, error });
  };

  return (
    <div>
      <h1>My Words</h1>
      <input
        type="text"
        value={newWord}
        onChange={(e) => setNewWord(e.target.value)}
        placeholder="Add a new word"
      />
      <button onClick={handleAddWord}>Add Word</button>
      {/* <ul>
        {words.map((word) => (
          <li key={word.id}>{word.word}</li>
        ))}
      </ul> */}
      <ul>
        {words.map((wordObj) => (
          <li key={wordObj.id}>{wordObj.words}</li> // 'words' is the property from JSON
        ))}
      </ul>
    </div>
  );
}

export default Library;
