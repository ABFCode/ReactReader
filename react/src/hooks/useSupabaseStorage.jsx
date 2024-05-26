import { useState } from "react";
import { supabase } from "../utils/supabaseClient";

const useSupabaseStorage = () => {
  const [uploadProgress, setUploadProgress] = useState(0);

  const uploadFile = async (file, storageKey) => {
    const { error } = await supabase.storage
      .from("book-uploads")
      .upload(storageKey, file, {
        upsert: false,
        cacheControl: "86400",
        progress: (event) =>
          setUploadProgress(Math.round(event.loaded / event.total) * 100),
      });

    if (error) {
      console.error("Error uploading book:", error);
      return false;
    }

    setUploadProgress(0);
    return true;
  };

  const getDownloadUrl = async (storageKey) => {
    const { data, error } = await supabase.storage
      .from("book-uploads")
      .download(storageKey);

    if (error) {
      console.error("Error getting download URL:", error);
      throw error;
    }

    return URL.createObjectURL(data);
  };

  return { uploadFile, getDownloadUrl, uploadProgress };
};

export default useSupabaseStorage;
