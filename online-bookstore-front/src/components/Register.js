import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ name: "", email: "", password: "" });
  const [apiError, setApiError] = useState("");

  const handleLoginClick = (e) => {
    e.preventDefault();
    navigate("/login");
  };

  const validateName = (name) => {
    const nameRegex = /^[A-Za-z]{3,}$/;
    return nameRegex.test(name);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,16}$/;
    return passwordRegex.test(password);
  };

  const handleNameChange = (e) => {
    const value = e.target.value;
    setName(value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      name: value
        ? validateName(value)
          ? ""
          : "Name must be at least 3 characters long and contain only letters."
        : "Name is required.",
    }));
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      email: value
        ? validateEmail(value)
          ? ""
          : "Please enter a valid email address."
        : "Email is required.",
    }));
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      password: value
        ? validatePassword(value)
          ? ""
          : "Password must be 8-16 characters, include letters, numbers, and symbols."
        : "Password is required.",
    }));
  };

  const handleBlur = (field, value) => {
    if (!value) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [field]: `${
          field.charAt(0).toUpperCase() + field.slice(1)
        } is required.`,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nameError = name
      ? validateName(name)
        ? ""
        : "Name must be at least 3 characters long and contain only letters."
      : "Name is required.";
    const emailError = email
      ? validateEmail(email)
        ? ""
        : "Please enter a valid email address."
      : "Email is required.";
    const passwordError = password
      ? validatePassword(password)
        ? ""
        : "Password must be 8-16 characters, include letters, numbers, and symbols."
      : "Password is required.";

    if (nameError || emailError || passwordError) {
      setErrors({
        name: nameError,
        email: emailError,
        password: passwordError,
      });
    } else {
      try {
        const response = await axios.post(
          "http://localhost:5001/api/auth/register", // Updated API endpoint
          { name, email, password },
          { headers: { "Content-Type": "application/json" } }
        );
        console.log("Registration successful:", response.data);
        navigate("/login");
      } catch (error) {
        if (error.response) {
          setApiError("Registration failed. Please try again.");
        } else if (error.request) {
          setApiError("Network error. Please try again later.");
        } else {
          setApiError("An unexpected error occurred.");
        }
      }
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6">Register</h1>
        <form className="w-full max-w-md" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className={`mt-1 p-2 block w-full border ${
                errors.name ? "border-red-500" : "border-gray-300"
              } rounded-md shadow-sm`}
              value={name}
              onChange={handleNameChange}
              onBlur={() => handleBlur("name", name)}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              className={`mt-1 p-2 block w-full border ${
                errors.email ? "border-red-500" : "border-gray-300"
              } rounded-md shadow-sm`}
              value={email}
              onChange={handleEmailChange}
              onBlur={() => handleBlur("email", email)}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              className={`mt-1 p-2 block w-full border ${
                errors.password ? "border-red-500" : "border-gray-300"
              } rounded-md shadow-sm`}
              value={password}
              onChange={handlePasswordChange}
              onBlur={() => handleBlur("password", password)}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          {apiError && (
            <div className="bg-red-100 text-red-700 p-2 rounded-md mb-4">
              {apiError}
            </div>
          )}

          <div className="mt-6">
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md"
            >
              Register
            </button>
          </div>

          <div className="mt-4 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-blue-500 hover:underline"
              onClick={handleLoginClick}
            >
              Login
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
