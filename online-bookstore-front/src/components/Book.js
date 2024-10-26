import React, { useState, useEffect, useRef } from "react"; 
import { useNavigate } from "react-router-dom"; 
import axios from "axios";

const BooksPage = () => {
  const [books, setBooks] = useState([]);
  const [newBook, setNewBook] = useState({
    title: "",
    author: "",
    price: "",
    description: "",
    stock: "",
  });
  const [visibleCount, setVisibleCount] = useState(6);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [stockAdjustment, setStockAdjustment] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [sessionExpired, setSessionExpired] = useState(false); 
  const [successMessage, setSuccessMessage] = useState(""); 

  const navigate = useNavigate(); 
  const inactivityTimer = useRef(null); 

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5001/api/books/books"
        );
        setBooks(response.data);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };

    fetchBooks();

    // Set the inactivity timeout
    const resetTimer = () => {
      clearTimeout(inactivityTimer.current); 
      setSessionExpired(false); 
      inactivityTimer.current = setTimeout(() => {
        setSessionExpired(true); 
        alert("Session expired. Redirecting to login."); 
        navigate("/login"); 
      }, 5 * 60 * 1000); // 5 minutes in milliseconds
    };

    // Event listeners to detect user activity
    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keydown", resetTimer);

    // Start the timer when the component mounts
    resetTimer();

    // Clean up event listeners and timeout on component unmount
    return () => {
      clearTimeout(inactivityTimer.current);
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keydown", resetTimer);
    };
  }, [navigate]); // Add navigate to dependencies

  const handleChange = (e) => {
    setNewBook({ ...newBook, [e.target.name]: e.target.value });
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5001/api/books/book",
        newBook
      );
      setBooks([...books, response.data]);
      setNewBook({
        title: "",
        author: "",
        price: "",
        description: "",
        stock: "",
      });
      setIsAddModalOpen(false);
      setSuccessMessage("Book added successfully!"); 
      setTimeout(() => setSuccessMessage(""), 3000); // Clear message after 3 seconds
    } catch (error) {
      console.error("Error adding book:", error);
    }
  };

  const openEditModal = (book) => {
    setSelectedBook(book);
    setNewBook(book);
    setIsEditModalOpen(true);
    setStockAdjustment(0);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const updatedStock = Math.max(0, selectedBook.stock + stockAdjustment);
      const updatedBook = { ...newBook, stock: updatedStock };

      const response = await axios.put(
        `http://localhost:5001/api/books/book/${selectedBook._id}`,
        updatedBook
      );
      setBooks(
        books.map((book) =>
          book._id === selectedBook._id ? response.data : book
        )
      );
      setIsEditModalOpen(false);
      setSelectedBook(null);
      setNewBook({
        title: "",
        author: "",
        price: "",
        description: "",
        stock: "",
      });
      setStockAdjustment(0);
      setSuccessMessage("Book updated successfully!"); 
      setTimeout(() => setSuccessMessage(""), 3000); // Clear message after 3 seconds
    } catch (error) {
      console.error("Error updating book:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(
        `http://localhost:5001/api/books/book/${selectedBook._id}`
      );
      setBooks(books.filter((book) => book._id !== selectedBook._id));
      setIsEditModalOpen(false);
      setSelectedBook(null);
      setSuccessMessage("Book deleted successfully!"); 
      setTimeout(() => setSuccessMessage(""), 3000); // Clear message after 3 seconds
    } catch (error) {
      console.error("Error deleting book:", error);
    }
  };

  const handleShowMore = () => {
    setVisibleCount((prevCount) => prevCount + 6);
  };

  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-8">
      {/* Session Expiration Message */}
      {sessionExpired && (
        <div className="bg-red-200 text-red-600 p-4 rounded mb-4">
          Your session has expired. You will be redirected to the login page.
        </div>
      )}

      {/* Success Message */}
      {successMessage && (
        <div className="fixed inset-0 flex items-center justify-center">
          <div className="bg-green-200 text-green-600 p-4 rounded mb-4">
            {successMessage}
          </div>
        </div>
      )}

      {/* Header with title and search bar */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Browse Books</h1>

        {/* Search Bar */}
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search by book title"
          className="border p-2 w-1/3 rounded-md border-blue-600"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
        {filteredBooks.slice(0, visibleCount).map((book) => (
          <div
            key={book._id}
            onClick={() => openEditModal(book)}
            className="border p-4 rounded shadow cursor-pointer"
          >
            <h2 className="text-xl font-semibold">{book.title}</h2>
            <p>Author: {book.author}</p>
            <p>Price: ${book.price}</p>
            <p>{book.description}</p>
            <p>Stock: {book.stock}</p>
          </div>
        ))}
      </div>

      {visibleCount < filteredBooks.length && (
        <div className="text-center">
          <button
            onClick={handleShowMore}
            className="bg-blue-600 text-white px-4 py-2 rounded mx-auto"
          >
            See More
          </button>
        </div>
      )}

      {/* Add Book Button */}
      <div className="fixed bottom-4 right-4">
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-green-600 text-white rounded-full w-12 h-12 text-3xl flex items-center justify-center"
        >
          +
        </button>
      </div>

      {/* Add and Edit Modals */}
      {isAddModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-2xl font-bold mb-4">Add a New Book</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="title"
                value={newBook.title}
                onChange={handleChange}
                placeholder="Title"
                className="border p-2 w-full"
                required
              />
              <input
                type="text"
                name="author"
                value={newBook.author}
                onChange={handleChange}
                placeholder="Author"
                className="border p-2 w-full"
                required
              />
              <input
                type="number"
                name="price"
                value={newBook.price}
                onChange={handleChange}
                placeholder="Price"
                className="border p-2 w-full"
                required
              />
              <input
                type="text"
                name="description"
                value={newBook.description}
                onChange={handleChange}
                placeholder="Description"
                className="border p-2 w-full"
              />
              <input
                type="number"
                name="stock"
                value={newBook.stock}
                onChange={handleChange}
                placeholder="Stock"
                className="border p-2 w-full"
                required
              />
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="bg-gray-300 text-black px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isEditModalOpen && selectedBook && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-2xl font-bold mb-4">Edit Book</h2>
            <form onSubmit={handleUpdate} className="space-y-4">
              <input
                type="text"
                name="title"
                value={newBook.title}
                onChange={handleChange}
                placeholder="Title"
                className="border p-2 w-full"
                required
              />
              <input
                type="text"
                name="author"
                value={newBook.author}
                onChange={handleChange}
                placeholder="Author"
                className="border p-2 w-full"
                required
              />
              <input
                type="number"
                name="price"
                value={newBook.price}
                onChange={handleChange}
                placeholder="Price"
                className="border p-2 w-full"
                required
              />
              <input
                type="text"
                name="description"
                value={newBook.description}
                onChange={handleChange}
                placeholder="Description"
                className="border p-2 w-full"
              />
              <input
                type="number"
                value={stockAdjustment}
                onChange={(e) => setStockAdjustment(parseInt(e.target.value))}
                placeholder="Stock Adjustment"
                className="border p-2 w-full"
              />
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="bg-gray-300 text-black px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Update
                </button>
                <button
                type="button"
                onClick={handleDelete}
                className="bg-red-600 text-white px-4 py-2 rounded"
              >
                Delete
              </button>
              </div> 
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BooksPage;
