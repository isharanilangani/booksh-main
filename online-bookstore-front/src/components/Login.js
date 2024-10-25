import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";

const LoginPage = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [apiError, setApiError] = useState("");

  const handleRegisterClick = (e) => {
    e.preventDefault();
    navigate("/register");
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

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      email: getEmailError(value),
    }));
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      password: getPasswordError(value),
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

    const emailError = getEmailError(email);
    const passwordError = getPasswordError(password);

    if (emailError || passwordError) {
      setErrors({ email: emailError, password: passwordError });
    } else {
      try {
        const response = await axios.post(
          "http://localhost:5001/api/auth/login",
          { email, password },
          {
            headers: { "Content-Type": "application/json" },
          }
        );

        const responseData = response.data; 
        if (responseData) {
          const { id } = responseData;
          Cookies.set("authData", JSON.stringify(responseData), { expires: 7 });
          navigate(`/books?email=${encodeURIComponent(email)}&id=${id}`);
        } else {
          setApiError("Failed to retrieve data from the server.");
        }
      } catch (error) {
        if (error.response) {
          setApiError(
            "Login failed. Please check your credentials and try again."
          );
        } else if (error.request) {
          setApiError("Network error. Please try again later.");
        } else {
          setApiError("An unexpected error occurred.");
        }
      }
    }
  };

  const getEmailError = (email) => {
    if (!email) {
      return "Email is required.";
    }
    if (!validateEmail(email)) {
      return "Please enter a valid email address.";
    }
    return "";
  };

  const getPasswordError = (password) => {
    if (!password) {
      return "Password is required.";
    }
    if (!validatePassword(password)) {
      return "Password must be 8-16 characters, include letters, numbers, and symbols.";
    }
    return "";
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6">Login</h1>

        <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              <span className="text-red-500">*</span> Email
            </label>
            <input
              id="email"
              type="email"
              className={`mt-1 block w-full px-3 py-2 border ${
                errors.email ? "border-red-500" : "border-gray-300"
              } rounded-md shadow-sm focus:outline-none focus:ring focus:ring-opacity-50`}
              value={email}
              onChange={handleEmailChange}
              onBlur={() => handleBlur("email", email)}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              <span className="text-red-500">*</span> Password
            </label>
            <input
              id="password"
              type="password"
              className={`mt-1 block w-full px-3 py-2 border ${
                errors.password ? "border-red-500" : "border-gray-300"
              } rounded-md shadow-sm focus:outline-none focus:ring focus:ring-opacity-50`}
              value={password}
              onChange={handlePasswordChange}
              onBlur={() => handleBlur("password", password)}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password}</p>
            )}
          </div>

          {apiError && (
            <div className="bg-red-100 text-red-700 p-3 rounded-md">
              {apiError}
            </div>
          )}

          <div className="mt-6">
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md"
            >
              Login
            </button>
          </div>

          <div className="mt-4 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <a
              href="/register"
              onClick={handleRegisterClick}
              className="text-blue-500 hover:underline"
            >
              Register
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
