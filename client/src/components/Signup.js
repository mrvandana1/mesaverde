import React, { useState } from "react";
import axios from "../api";
import "./Signup.css"; // Import CSS file for styles

function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    accountNumber: "",
    password: "",
  });
  const [message, setMessage] = useState(""); // This will show success or error message
  const [loading, setLoading] = useState(false); // Show loading indicator during submission

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading
    setMessage(""); // Clear any previous messages
    try {
      const response = await axios.post("/auth/signup", formData);
      setMessage(response.data.message); // Assuming backend sends a success message
    } catch (error) {
      // Handle backend or network errors
      if (error.response) {
        setMessage(error.response.data.message || "Error signing up");
      } else if (error.request) {
        setMessage("Error connecting to the server");
      } else {
        setMessage("Unexpected error occurred");
      }
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="signup-container">
      <h1 className="signup-title">Create an Account</h1>
      <form onSubmit={handleSubmit} className="signup-form">
        <input
          type="text"
          placeholder="Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="signup-input"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="signup-input"
          required
        />
        <input
          type="tel"
          placeholder="Phone Number"
          value={formData.phoneNumber}
          onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
          className="signup-input"
          required
        />
        <input
          type="text"
          placeholder="Account Number"
          value={formData.accountNumber}
          onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
          className="signup-input"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          className="signup-input"
          required
        />
        <button
          type="submit"
          className="signup-button"
          disabled={loading} // Disable button while loading
        >
          {loading ? "Signing up..." : "Signup"}
        </button>
      </form>
      {message && <p className={`message ${message.toLowerCase().includes("error") ? "error" : "success"}`}>{message}</p>}
    </div>
  );
}

export default Signup;
