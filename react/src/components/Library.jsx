import { useEffect, useRef, useState } from "react";
import { useAuth } from "../hooks/auth";
import { supabase } from "../utils/supabaseClient";
import { Link } from "react-router-dom";
import useSupabaseStorage from "../hooks/useSupabaseStorage";
import useBookOperations from "../hooks/useBookOperations";

import {
  Card,
  Image,
  Text,
  Group,
  SimpleGrid,
  LoadingOverlay,
  Title,
  Button,
  Space,
  Stack,
  ActionIcon,
  Modal,
  TextInput,
} from "@mantine/core";

function Library() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingBook, setEditingBook] = useState(null);
  const { user } = useAuth(); // Get the current user from your AuthContext
  const { deleteBook, updateBook } = useBookOperations();
  const { uploadFile, downloadFile } = useSupabaseStorage();

  const fileInputRef = useRef(null);

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
      const fileName = `${user.id}-${Date.now()}-${file.name}`;
      const storageKey = `books/${fileName}`;
      //const filePath = file.path;

      const uploadSuccess = await uploadFile(file, storageKey);

      if (!uploadSuccess) {
        console.error("Failed to upload book in Library");
        return;
      }
      //store metadata in DB
      const { data, error } = await supabase
        .from("books")
        .insert([
          {
            user_id: user.id,
            title: file.name,
            author: "Unknown",
            filepath: storageKey,
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

  const handleButtonClick = () => {
    fileInputRef.current.click(); // Trigger the click event on the hidden input
  };

  const handleDeleteBook = async (bookId) => {
    try {
      const success = await deleteBook(bookId);
      console.log("Success is:", success);

      if (success) {
        setBooks(books.filter((book) => book.id !== bookId));
      } else {
        console.error("Error deleting book");
      }
    } catch (error) {
      console.error("Error deleting book:", error);
    }
  };

  const handleUpdateBook = async (e) => {
    e.preventDefault();
    if (!editingBook) return;

    const { title, author } = editingBook;

    try {
      const success = await updateBook(editingBook.id, { title, author });

      if (success) {
        setBooks(
          books.map((b) =>
            b.id === editingBook.id ? { ...b, title, author } : b
          )
        );
        setEditingBook(null);
      } else {
        console.error("Error updating book");
      }
    } catch (error) {
      console.error("Error updating book");
    }
  };

  const handleEditBookChange = (field, value) => {
    setEditingBook((currentBook) => ({ ...currentBook, [field]: value }));
  };

  const handleDownloadBook = (book) => {
    downloadFile(book.filepath, `${book.title}.epub`);
  };

  return (
    <div style={{ padding: "2rem" }}>
      <input
        type="file"
        ref={fileInputRef} // Attach reference to the file input
        style={{ display: "none" }} // Hide the file input
        onChange={handleFileSelect} // Handle file selection
      />
      <Group mb="xl">
        <Title order={2}>My Library</Title>
        <Stack spacing="xs">
          {/* Vertical stack for buttons */}
          <Button
            onClick={handleButtonClick} /* Add your file input logic here */
          >
            Add New Book
          </Button>
          <Button component={Link} to="/">
            Go to Home
          </Button>
        </Stack>
      </Group>

      <Space h="xl" />
      <LoadingOverlay visible={loading} />
      <SimpleGrid cols={4} spacing={"lg"} mt="xl">
        {books.map((book) => (
          <Card key={book.id} shadow="sm" p="lg">
            <Card.Section>
              <Image
                src="https://via.placeholder.com/300"
                height={160}
                alt="book cover"
              />
            </Card.Section>

            <Group position="apart" mt="md" mb="xs">
              <Text weight={500}>{book.title}</Text>
              <Text size="sm" c="dimmed">
                {book.author}
              </Text>
            </Group>
            <Button onClick={() => handleDownloadBook(book)}>Download</Button>
            <ActionIcon
              variant="outline"
              color="red"
              onClick={() => handleDeleteBook(book.id)}
            >
              X
            </ActionIcon>
            <ActionIcon
              variant="outline"
              color="blue"
              onClick={() => setEditingBook(book)}
            >
              Edit
            </ActionIcon>
          </Card>
        ))}
      </SimpleGrid>

      {/* Edit Modal */}
      <Modal
        opened={editingBook !== null}
        onClose={() => setEditingBook(null)}
        title="Edit Book"
      >
        {editingBook && (
          <form onSubmit={handleUpdateBook}>
            <TextInput
              label="Title"
              value={editingBook.title}
              onChange={(e) => handleEditBookChange("title", e.target.value)}
              required
            />

            <TextInput
              label="Author"
              value={editingBook.author}
              onChange={(e) => handleEditBookChange("author", e.target.value)}
              required
            />

            <Button type="submit" mt="md">
              Save
            </Button>
          </form>
        )}
      </Modal>
    </div>
  );
}

export default Library;
