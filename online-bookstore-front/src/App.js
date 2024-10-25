import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Register from "./components/Register";
import Login from "./components/Login";
import Home from "./components/Home";
import About from "./components/About";
import Book from "./components/Book";

function App() {
  const location = useLocation();

  // Array of paths where Navbar should be shown
  const showNavbarPaths = ["/home", "/about"];

  return (
    <>
      {/* Render Navbar only for Home and About pages */}
      {showNavbarPaths.includes(location.pathname) && <Navbar />}
      
      <Routes>
        {/* Default route now navigates to the Home page */}
        <Route path="/" element={<Navigate to="/home" />} />
        
        {/* Home page */}
        <Route path="/home" element={<Home />} />
        
        {/* About page */}
        <Route path="/about" element={<About />} />

        {/* Register page */}
        <Route path="/register" element={<Register />} />

        {/* Login page */}
        <Route path="/login" element={<Login />} />

        {/* Book page */}
        <Route path="/books" element={<Book />} />
      </Routes>
    </>
  );
}

const AppWithRouter = () => (
  <Router>
    <App />
  </Router>
);

export default AppWithRouter;
