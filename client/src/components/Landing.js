import React, { useState } from "react";
import { Link } from "react-router-dom";
import './Landing.css'; // Import the external CSS file

const Landing = () => {
    return (
        <div className="landing-container">
            <h1 className="landing-title">Welcome to Our App</h1>
            <p className="landing-subtitle">Please select an option to get started:</p>
            <div className="button-container">
                <Link to="/login" className="landing-button">
                    Login
                </Link>
                <Link to="/signup" className="landing-button">
                    Signup
                </Link>
                <Link to="/aboutus" className="landing-button">
                    About Us
                </Link>
            </div>
        </div>
    );
};

export default Landing;
