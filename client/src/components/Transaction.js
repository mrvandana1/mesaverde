import React, { useState, useEffect } from "react";
import axios from "../api"; // Assuming axios is set up to use the correct base URL
import "./Profile.css";

function Transaction() {
  const [activeTab, setActiveTab] = useState("make"); // To toggle between tabs
  const [transactionHistory, setTransactionHistory] = useState([]); // To store transaction history
  const [transactionData, setTransactionData] = useState({
    accountNumber: "",
    amount: "",
  });
  const [message, setMessage] = useState(""); // To show success/error messages

  // Fetch transaction history when "View Transactions" tab is active
  useEffect(() => {
    const fetchTransactions = async () => {
      if (activeTab === "view") {
        try {
          //setLoading(true);
          const token = localStorage.getItem("token");
          const useritem = localStorage.getItem("user");
          const user = JSON.parse(useritem);
          console.log("frontend get transaction");
          console.log(user);
          const response = await axios.get("/Transaction", 
            {
              user:user,
            },
            {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setTransactionHistory(response.data); // Assume backend returns an array of transactions
        } catch (error) {
          console.error("Error fetching transaction history:", error);
        }
      }
    };

    fetchTransactions();
  }, [activeTab]);

  // Handle input change
  const handleInputChange = (e) => {
    setTransactionData({
      ...transactionData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle transaction submission
  const handleTransactionSubmit = async (e) => {
    console.log("frontend trnasaction hit");
    // const storageData = Object.keys(localStorage).map((key) => {
    //   return { key, value: localStorage.getItem(key) };
    // });
    // console.log("LocalStorage Data:", storageData);
    
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const useritem = localStorage.getItem("user");
      const user = JSON.parse(useritem);
      console.log(user);
      console.log(user.id);
      const response = await axios.post(
        "/Transaction",
        {
          accountNumber: transactionData.accountNumber,
          amount: transactionData.amount,
          user: user,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage("Transaction successful!");
      setTransactionData({ accountNumber: "", amount: "" }); // Reset form
    } catch (error) {
      console.error("Error processing transaction:", error);
      setMessage("Transaction failed. Please try again.");
    }
  };

  return (
    <div className="transaction-container">
      {/* Tabs */}
      <div className="transaction-tabs">
        <button
          className={`transaction-tab ${activeTab === "make" ? "active" : ""}`}
          onClick={() => setActiveTab("make")}
        >
          Make Transaction
        </button>
        <button
          className={`transaction-tab ${activeTab === "view" ? "active" : ""}`}
          onClick={() => setActiveTab("view")}
        >
          View Transactions
        </button>
      </div>

      {/* Make Transaction Form */}
      {activeTab === "make" && (
        <form className="make-transaction-form" onSubmit={handleTransactionSubmit}>
          <label>
            Receiver Account Number:
            <input
              type="text"
              name="accountNumber"
              value={transactionData.accountNumber}
              onChange={handleInputChange}
              required
            />
          </label>
          <label>
            Amount:
            <input
              type="number"
              name="amount"
              value={transactionData.amount}
              onChange={handleInputChange}
              required
            />
          </label>
          <button type="submit">Submit</button>
          {message && <p className="transaction-message">{message}</p>}
        </form>
      )}

      {/* View Transactions */}
      {activeTab === "view" && (
        <div className="view-transactions">
          {transactionHistory.length === 0 ? (
            <p>No transactions found.</p>
          ) : (
            <table className="transaction-history-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Receiver</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {transactionHistory.map((transaction, index) => (
                  <tr key={index}>
                    <td>{transaction.date}</td>
                    <td>{transaction.receiver}</td>
                    <td>${transaction.amount}</td>
                    <td>{transaction.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}

export default Transaction;
