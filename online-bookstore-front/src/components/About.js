import React from "react";

const About = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-blue-600 py-6 shadow-lg">
        <h1 className="text-white text-4xl font-bold text-center">About Us</h1>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center px-4 text-center">
        <h2 className="text-3xl font-semibold text-gray-800 mb-4">
          Welcome to My Bookstore
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mb-8">
          At Our Bookstore, we’re dedicated to bringing you the best selection
          of books across all genres. Our mission is to make it easy for book
          lovers to discover new titles and purchase their favorites, all in one
          place.
        </p>
        <p className="text-lg text-gray-600 max-w-2xl mb-8">
          Whether you're searching for a gripping novel, a valuable reference
          book, or a beloved classic, we have something for everyone. We believe
          in the power of reading to inspire, educate, and entertain, and we’re
          here to support your reading journey.
        </p>
        <p className="text-lg text-gray-600 max-w-2xl mb-8">
          Thank you for choosing Our Bookstore. We’re thrilled to be part of
          your reading experience and look forward to serving you!
        </p>
      </main>

      <footer className="bg-gray-200 py-4">
        <p className="text-center text-gray-600">
          © 2024 My Bookstore. All Rights Reserved.
        </p>
      </footer>
    </div>
  );
};

export default About;
