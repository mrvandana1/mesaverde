import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api"; // Assuming axios is set up to use the correct base URL
import "./Profile.css";
import Transaction from "./Transaction"; // Import Transaction component

function Profile() {
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showTransaction, setShowTransaction] = useState(false); // Toggle transaction component
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/"); // Redirect if no token is found
        return;
      }

      try {
        // Fetch profile data
        const response = await axios.get("/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data);
        console.log(response.data._id);
        console.log("profile hit");
        localStorage.setItem("userId", response.data.id); 
      } catch (error) {
        console.error("Error fetching profile data", error);
        navigate("/");
      }
    };

    fetchData();
  }, [navigate]);

  if (!user) return <p>Loading...</p>;

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="profile-container">
      <h1>Welcome, {user.name}!</h1>

      <button className="menu-button" onClick={toggleMenu}>
        ☰ Menu
      </button>

      {/* Side Panel */}
      {isMenuOpen && (
        <div className="side-panel">
          <button className="close-button" onClick={toggleMenu}>
            &times;
          </button>
          <div className="menu-option" onClick={handleLogout}>
            Logout
          </div>
          <div className="menu-option" onClick={() => navigate("/update-profile")}>
            Update Profile
          </div>
          <div className="menu-option" onClick={() => setShowTransaction(!showTransaction)}>
            Transactions
          </div>
        </div>
      )}

      <div className="profile-details">
        <div className="profile-item">
          <strong>Email:</strong> {user.email}
        </div>
        <div className="profile-item">
          <strong>Phone Number:</strong> {user.phoneNumber}
        </div>
        <div className="profile-item">
          <strong>Account Number:</strong> {user.accountNumber}
        </div>
        <div className="profile-item">
          <strong>Account Balance:</strong> ${user.accountBalance}
        </div>
        <div className="profile-item">
          <strong>Role:</strong> {user.role}
        </div>
      </div>

      {/* Render Transactions component if toggled */}
      {showTransaction && <Transaction />}
    </div>
  );
}

export default Profile;
