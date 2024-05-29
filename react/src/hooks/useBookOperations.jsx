import { supabase } from "../utils/supabaseClient";

const useBookOperations = () => {
  const deleteBook = async (bookId) => {
    try {
      //Fetch book info from DB
      const { data: book, error } = await supabase
        .from("books")
        .select("*")
        .eq("id", bookId)
        .single();

      if (error) {
        console.error("Error fetching book:", error);
        throw error;
      }

      //Delete book from bucket
      const { error: storageError } = await supabase.storage
        .from("book-uploads")
        .remove([book.filepath]);

      if (storageError) {
        console.error("Error deleting book from storage", storageError);
        throw storageError;
      }

      const { error: dbError } = await supabase
        .from("books")
        .delete()
        .eq("id", bookId);

      if (dbError) {
        console.error("Error deleting book from DB:", dbError);
        throw error;
      }
      return true;
    } catch (error) {
      console.error("Error deleting book:", error);
      return false;
    }
  };

  return { deleteBook };
};

export default useBookOperations;
