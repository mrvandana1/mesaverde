import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api"; // Assuming axios is set up to use the correct base URL
import './Profile.css';  

function Profile() {
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State to track menu open/close
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/"); // Redirect if no token is found
        return;
      }

      try {
        // Make an API call to the backend to fetch the user profile data
        const response = await axios.get("/profile", {
          headers: {
            Authorization: `Bearer ${token}`, // Send token in header
          },
        });
        setUser(response.data); // Store user data in state
      } catch (error) {
        console.error("Error fetching profile data", error);
        navigate("/"); // Redirect if there's an error (e.g., token expired)
      }
    };

    fetchData();
  }, [navigate]);

  if (!user) return <p>Loading...</p>;

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen); // Toggle menu state

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
          {/* Close Button */}
          <button className="close-button" onClick={toggleMenu}>
            &times;
          </button>
          
          <div className="menu-option" onClick={handleLogout}>
            Logout
          </div>
          <div className="menu-option" onClick={() => navigate("/transfer")}>
            Transfer
          </div>
          <div className="menu-option" onClick={() => navigate("/update-profile")}>
            Update Profile
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
    </div>
  );
}

export default Profile;
