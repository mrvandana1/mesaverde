import React from "react";
import ReactDOM from "react-dom/client"; // For React 18+
import App from "./App"; // Import the root component
import "./index.css"; // Optional: Global CSS file for styling

// Find the root DOM element in the HTML (usually <div id="root">)
const root = ReactDOM.createRoot(document.getElementById("root"));

// Render the App component into the root DOM element
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
