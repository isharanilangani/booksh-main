import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-blue-600 p-4 shadow-lg">
      <div className="container mx-auto flex justify-center space-x-8">
        <Link to="/" className="text-white hover:underline">
          Home
        </Link>
        <Link to="/about" className="text-white hover:underline">
          About Us
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
