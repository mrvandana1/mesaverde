const express = require("express");
const router = express.Router();
const Transaction = require("../models/Transaction");
const User = require("../models/User");
const authenticate = require("./auth"); // Correct path to `auth.js` in `routes`

// POST /transactions - Make a transaction
router.post("/", authenticate, async (req, res) => {
  console.log("POST /Transaction hit");


  const { accountNumber, amount, user } = req.body; // Changed `amountt` to `amount`

  const parsedAmount = Number(amount); // Ensure amount is a number

  if (!accountNumber || !parsedAmount) {
    return res.status(400).json({ error: "Account number and amount are required." });
  }

  if (parsedAmount <= 0) {
    return res.status(400).json({ error: "Transaction amount must be greater than zero." });
  }

  try {
    const sender = await User.findById(user.id);
    if (!sender) {
      return res.status(404).json({ error: "Sender not found." });
    }

    const receiver = await User.findOne({ accountNumber });
    if (!receiver) {
      return res.status(404).json({ error: "Receiver not found." });
    }

    // Ensure balances are numbers
    sender.accountBalance = Number(sender.accountBalance);
    receiver.accountBalance = Number(receiver.accountBalance);

    if (sender.accountBalance < parsedAmount) {
      return res.status(400).json({ error: "Insufficient balance." });
    }

    // Update balances
    // console.log("consolel loggs");
    // console.log(sender.accountBalance);
    // console.log(receiver.accountBalance );
    // console.log(parsedAmount);
    sender.accountBalance -= parsedAmount;
    receiver.accountBalance += parsedAmount;
    // console.log(sender.accountBalance);
    // console.log(receiver.accountBalance );

    // Save the sender and receiver updates to the database
    await sender.save();
    await receiver.save();

    // Log the transaction
    const transaction = new Transaction({
      sender: sender._id,
      receiverAccountNumber: accountNumber,
      amount: parsedAmount,
      status: "Success", // Ensure status is set correctly
    });

    await transaction.save();

    res.status(200).json({ message: "Transaction successful!", transaction });
  } catch (error) {
    console.error("Transaction error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

// GET /transactions - Fetch Transaction History
router.get("/", authenticate, async (req, res) => {
  console.log("Transaction get");
  console.log(req.body);
  const userId=req.user.id;

  

  try {
    // Fetch the user's account number
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }
    const accountNumber = user.accountNumber;
    // Fetch sent and received transactions
    const sentTransactions = await Transaction.find({ sender: userId }).sort({ date: -1 });
    const receivedTransactions = await Transaction.find({ receiverAccountNumber: accountNumber }).sort({ date: -1 });

    // Return the transaction history
    res.status(200).json({
      sent: sentTransactions,
      received: receivedTransactions,
    });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

module.exports = router;
