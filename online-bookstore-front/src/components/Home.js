import React from "react";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-blue-600 py-6 shadow-lg">
        <h1 className="text-white text-4xl font-bold text-center">
          Welcome to My Bookstore
        </h1>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center px-4 text-center">
        <h2 className="text-3xl font-semibold text-gray-800 mb-4">
          Find Your Next Favorite Book
        </h2>
        <p className="text-lg text-gray-600 max-w-lg mb-8">
          Browse our carefully curated selection of books across various genres
          and discover new titles that inspire, entertain, and educate. Whether
          you're looking for the latest bestseller or a hidden gem, our
          bookstore has something for everyone!
        </p>
        <a
          href="/login"
          className="bg-blue-500 text-white py-2 px-6 rounded-full hover:bg-blue-700 transition duration-300"
        >
          Browse Books
        </a>
      </main>

      <footer className="bg-gray-200 py-4">
        <p className="text-center text-gray-600">
          © 2024 My Bookstore. All Rights Reserved.
        </p>
      </footer>
    </div>
  );
};

export default HomePage;
