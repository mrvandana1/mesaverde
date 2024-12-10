// const request = require('supertest');
// const express = require('express');
// const mongoose = require('mongoose');
// const Transaction = require('../models/Transaction');
// const User = require('../models/User');
// const transactionRoutes = require('../routes/transaction');
// const authenticate = require('../routes/auth');

// // Mock the authentication middleware
// jest.mock('../routes/auth', () => (req, res, next) => {
//   req.user = { id: 'user123' }; // Simulating a logged-in user
//   next();
// });

// // Mock the User and Transaction models
// jest.mock('../models/User');
// jest.mock('../models/Transaction');

// describe('POST /transactions', () => {
//   let app;

//   beforeAll(() => {
//     app = express();
//     app.use(express.json());
//     app.use('/transactions', transactionRoutes);  // Attach routes to /transactions
//   });

//   beforeEach(() => {
//     jest.clearAllMocks();
//   });

//   test('should make a successful transaction', async () => {
//     // Mock the user data and transaction data
//     const sender = {
//       id: 'user123',
//       accountBalance: 1000,
//       save: jest.fn().mockResolvedValue(true),
//     };
//     const receiver = {
//       accountNumber: 'receiver123',
//       accountBalance: 500,
//       save: jest.fn().mockResolvedValue(true),
//     };

//     User.findById.mockResolvedValue(sender);
//     User.findOne.mockResolvedValue(receiver);
//     Transaction.prototype.save.mockResolvedValue(true);

//     const response = await request(app)
//       .post('/transactions')
//       .send({ accountNumber: 'receiver123', amount: 100 })
//       .set('Authorization', 'Bearer mockToken');

//     expect(response.status).toBe(200);
//     expect(response.body.message).toBe('Transaction successful!');
//     expect(Transaction.prototype.save).toHaveBeenCalledTimes(1);
//   });

//   test('should return 400 if account number is missing', async () => {
//     const response = await request(app)
//       .post('/transactions')
//       .send({ amount: 100 })
//       .set('Authorization', 'Bearer mockToken');

//     expect(response.status).toBe(400);
//     expect(response.body.error).toBe('Account number and amount are required.');
//   });

//   test('should return 400 if amount is not greater than zero', async () => {
//     const response = await request(app)
//       .post('/transactions')
//       .send({ accountNumber: 'receiver123', amount: -100 })
//       .set('Authorization', 'Bearer mockToken');

//     expect(response.status).toBe(400);
//     expect(response.body.error).toBe('Transaction amount must be greater than zero.');
//   });

//   test('should return 404 if sender is not found', async () => {
//     User.findById.mockResolvedValue(null);  // Simulate no sender found

//     const response = await request(app)
//       .post('/transactions')
//       .send({ accountNumber: 'receiver123', amount: 100 })
//       .set('Authorization', 'Bearer mockToken');

//     expect(response.status).toBe(404);
//     expect(response.body.error).toBe('Sender not found.');
//   });

//   test('should return 404 if receiver is not found', async () => {
//     const sender = {
//       id: 'user123',
//       accountBalance: 1000,
//       save: jest.fn().mockResolvedValue(true),
//     };
//     User.findById.mockResolvedValue(sender);
//     User.findOne.mockResolvedValue(null);  // Simulate no receiver found

//     const response = await request(app)
//       .post('/transactions')
//       .send({ accountNumber: 'receiver123', amount: 100 })
//       .set('Authorization', 'Bearer mockToken');

//     expect(response.status).toBe(404);
//     expect(response.body.error).toBe('Receiver not found.');
//   });

//   test('should return 400 if sender has insufficient balance', async () => {
//     const sender = {
//       id: 'user123',
//       accountBalance: 50,  // Less than the amount
//       save: jest.fn().mockResolvedValue(true),
//     };
//     const receiver = {
//       accountNumber: 'receiver123',
//       accountBalance: 500,
//       save: jest.fn().mockResolvedValue(true),
//     };

//     User.findById.mockResolvedValue(sender);
//     User.findOne.mockResolvedValue(receiver);

//     const response = await request(app)
//       .post('/transactions')
//       .send({ accountNumber: 'receiver123', amount: 100 })
//       .set('Authorization', 'Bearer mockToken');

//     expect(response.status).toBe(400);
//     expect(response.body.error).toBe('Insufficient balance.');
//   });

//   test('should return 500 if an error occurs', async () => {
//     const sender = {
//       id: 'user123',
//       accountBalance: 1000,
//       save: jest.fn().mockRejectedValue(new Error('Database error')),
//     };

//     User.findById.mockResolvedValue(sender);

//     const response = await request(app)
//       .post('/transactions')
//       .send({ accountNumber: 'receiver123', amount: 100 })
//       .set('Authorization', 'Bearer mockToken');

//     expect(response.status).toBe(500);
//     expect(response.body.error).toBe('Internal server error.');
//   });
// });


// describe('GET /transactions', () => {
//     let app;
  
//     beforeAll(() => {
//       app = express();
//       app.use(express.json());
//       app.use('/transactions', transactionRoutes);
//     });
  
//     beforeEach(() => {
//       jest.clearAllMocks();
//     });
  
//     test('should return transaction history for the user', async () => {
//       const user = {
//         id: 'user123',
//         accountNumber: 'user123',
//       };
//       const sentTransactions = [
//         { sender: 'user123', receiverAccountNumber: 'receiver123', amount: 100, date: new Date() },
//       ];
//       const receivedTransactions = [
//         { sender: 'sender123', receiverAccountNumber: 'user123', amount: 200, date: new Date() },
//       ];
  
//       User.findById.mockResolvedValue(user);
//       Transaction.find.mockResolvedValueOnce(sentTransactions).mockResolvedValueOnce(receivedTransactions);
  
//       const response = await request(app)
//         .get('/transactions')
//         .set('Authorization', 'Bearer mockToken');
  
//       expect(response.status).toBe(200);
//       expect(response.body.sent.length).toBe(1);
//       expect(response.body.received.length).toBe(1);
//     });
  
//     test('should return 404 if user is not found', async () => {
//       User.findById.mockResolvedValue(null);  // Simulate user not found
  
//       const response = await request(app)
//         .get('/transactions')
//         .set('Authorization', 'Bearer mockToken');
  
//       expect(response.status).toBe(404);
//       expect(response.body.error).toBe('User not found.');
//     });
  
//     test('should return 500 if an error occurs', async () => {
//       User.findById.mockRejectedValue(new Error('Database error'));
  
//       const response = await request(app)
//         .get('/transactions')
//         .set('Authorization', 'Bearer mockToken');
  
//       expect(response.status).toBe(500);
//       expect(response.body.error).toBe('Internal server error.');
//     });
//   });
  
const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const transactionRoutes = require('../routes/Transaction');
const User = require('../models/User');
const Transaction = require('../models/Transaction');

// Set up Express app for testing
let app;
beforeAll(async () => {
  app = express();
  app.use(express.json());
  app.use('/transactions', transactionRoutes);

  // Connect to the test database
  const url = 'mongodb+srv://vandanamohanaraj:Vandana1087@cluster0.w8m80jg.mongodb.net/localhost:27017/test_db';
  await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
});

// Clean up after each test
afterEach(async () => {
  await Transaction.deleteMany({});
  await User.deleteMany({});
});

// Close the database connection after tests
afterAll(async () => {
  await mongoose.connection.close();
});

describe('POST /transactions', () => {
  test('should make a successful transaction', async () => {
    // Create test users
    const sender = new User({
      accountNumber: 'sender123',
      accountBalance: 1000,
      password: 'password',
    });
    const receiver = new User({
      accountNumber: 'receiver123',
      accountBalance: 500,
      password: 'password',
    });

    await sender.save();
    await receiver.save();

    // Perform the transaction
    const response = await request(app)
      .post('/transactions')
      .send({ accountNumber: 'receiver123', amount: 100, user: { id: sender._id } })
      .set('Authorization', 'Bearer mockToken'); // Simulate authentication with a mock token

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Transaction successful!');

    // Check if the balances were updated correctly
    const updatedSender = await User.findById(sender._id);
    const updatedReceiver = await User.findById(receiver._id);
    expect(updatedSender.accountBalance).toBe(900);
    expect(updatedReceiver.accountBalance).toBe(600);

    // Check if transaction was saved in the database
    const transaction = await Transaction.findOne({ sender: sender._id });
    expect(transaction).not.toBeNull();
    expect(transaction.amount).toBe(100);
    expect(transaction.status).toBe('Success');
  });

  test('should return 400 if account number is missing', async () => {
    const sender = new User({
      accountNumber: 'sender123',
      accountBalance: 1000,
      password: 'password',
    });
    await sender.save();

    const response = await request(app)
      .post('/transactions')
      .send({ amount: 100, user: { id: sender._id } })
      .set('Authorization', 'Bearer mockToken');

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Account number and amount are required.');
  });

  test('should return 400 if amount is not greater than zero', async () => {
    const sender = new User({
      accountNumber: 'sender123',
      accountBalance: 1000,
      password: 'password',
    });
    await sender.save();

    const response = await request(app)
      .post('/transactions')
      .send({ accountNumber: 'receiver123', amount: -100, user: { id: sender._id } })
      .set('Authorization', 'Bearer mockToken');

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Transaction amount must be greater than zero.');
  });

  test('should return 404 if sender is not found', async () => {
    const sender = new User({
      accountNumber: 'sender123',
      accountBalance: 1000,
      password: 'password',
    });
    await sender.save();

    const response = await request(app)
      .post('/transactions')
      .send({ accountNumber: 'receiver123', amount: 100, user: { id: 'nonexistentUserId' } })
      .set('Authorization', 'Bearer mockToken');

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Sender not found.');
  });

  test('should return 404 if receiver is not found', async () => {
    const sender = new User({
      accountNumber: 'sender123',
      accountBalance: 1000,
      password: 'password',
    });
    const receiver = new User({
      accountNumber: 'receiver123',
      accountBalance: 500,
      password: 'password',
    });
    await sender.save();

    const response = await request(app)
      .post('/transactions')
      .send({ accountNumber: 'nonexistentReceiver', amount: 100, user: { id: sender._id } })
      .set('Authorization', 'Bearer mockToken');

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Receiver not found.');
  });

  test('should return 400 if sender has insufficient balance', async () => {
    const sender = new User({
      accountNumber: 'sender123',
      accountBalance: 50,  // Less than the transaction amount
      password: 'password',
    });
    const receiver = new User({
      accountNumber: 'receiver123',
      accountBalance: 500,
      password: 'password',
    });
    await sender.save();
    await receiver.save();

    const response = await request(app)
      .post('/transactions')
      .send({ accountNumber: 'receiver123', amount: 100, user: { id: sender._id } })
      .set('Authorization', 'Bearer mockToken');

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Insufficient balance.');
  });

  test('should return 500 if an error occurs during transaction', async () => {
    const sender = new User({
      accountNumber: 'sender123',
      accountBalance: 1000,
      password: 'password',
    });
    const receiver = new User({
      accountNumber: 'receiver123',
      accountBalance: 500,
      password: 'password',
    });
    await sender.save();
    await receiver.save();

    // Simulate a database error
    jest.spyOn(User, 'findById').mockRejectedValueOnce(new Error('Database error'));

    const response = await request(app)
      .post('/transactions')
      .send({ accountNumber: 'receiver123', amount: 100, user: { id: sender._id } })
      .set('Authorization', 'Bearer mockToken');

    expect(response.status).toBe(500);
    expect(response.body.error).toBe('Internal server error.');
  });
});
describe('GET /transactions', () => {
    test('should return transaction history for the user', async () => {
      // Create test users
      const sender = new User({
        accountNumber: 'sender123',
        accountBalance: 1000,
        password: 'password',
      });
      const receiver = new User({
        accountNumber: 'receiver123',
        accountBalance: 500,
        password: 'password',
      });
  
      await sender.save();
      await receiver.save();
  
      // Perform a transaction
      const transaction = new Transaction({
        sender: sender._id,
        receiverAccountNumber: 'receiver123',
        amount: 100,
        status: 'Success',
      });
      await transaction.save();
  
      const response = await request(app)
        .get('/transactions')
        .set('Authorization', 'Bearer mockToken'); // Simulate authentication
  
      expect(response.status).toBe(200);
      expect(response.body.sent.length).toBeGreaterThan(0);
      expect(response.body.received.length).toBeGreaterThan(0);
    });
  
    test('should return 404 if user is not found', async () => {
      const response = await request(app)
        .get('/transactions')
        .set('Authorization', 'Bearer mockToken'); // Simulate authentication
  
      expect(response.status).toBe(404);
      expect(response.body.error).toBe('User not found.');
    });
  
    test('should return 500 if an error occurs during fetching transactions', async () => {
      jest.spyOn(Transaction, 'find').mockRejectedValueOnce(new Error('Database error'));
  
      const response = await request(app)
        .get('/transactions')
        .set('Authorization', 'Bearer mockToken');
  
      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Internal server error.');
    });
  });
  