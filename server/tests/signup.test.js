// signup.test.js
const request = require('supertest');
const express = require('express');
const router = require('../routes/auth');  // Import your auth routes from the correct path
const User = require('../models/User');   // Import your User model
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

// Setup mock app
const app = express();
app.use(express.json());
app.use("/api/auth", router); // Use the auth routes for the /api/auth endpoint

// Mock database operations (optional, if you're not using a real DB in tests)
jest.mock('../models/User');  // Mock the User model

describe("POST /api/auth/signup", () => {
  beforeAll(() => {
    mongoose.connect("mongodb+srv://vandanamohanaraj:Vandana1087@cluster0.w8m80jg.mongodb.net/se", { useNewUrlParser: true, useUnifiedTopology: true });
  });

  afterAll(() => {
    mongoose.connection.close();
  });

  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test to avoid interference
  });

  it("should return 400 if password field is missing", async () => {
    const response = await request(app)
      .post('/api/auth/signup')
      .send({
        name: "John Doe",
        email: "john@example.com",
        phoneNumber: "1234567890",
        accountNumber: "9876543210"
        // Missing password
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("All fields are required");
  });
  it("should return 400 if  name field is missing", async () => {
    const response = await request(app)
      .post('/api/auth/signup')
      .send({
        
        email: "john@example.com",
        phoneNumber: "1234567890",
        accountNumber: "9876543210",
        password :"Password123"
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("All fields are required");
  });
  it("should return 400 if email field is missing", async () => {
    const response = await request(app)
      .post('/api/auth/signup')
      .send({
        name: "John Doe",
        phoneNumber: "1234567890",
        accountNumber: "9876543210",
        password :"Password123"
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("All fields are required");
  });
  it("should return 400 if account number field is missing", async () => {
    const response = await request(app)
      .post('/api/auth/signup')
      .send({
        name: "John Doe",
        email: "john@example.com",
        phoneNumber: "1234567890",
        
        password :"Password123"
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("All fields are required");
  });

  it("should return 400 if email format is invalid", async () => {
    const response = await request(app)
      .post('/api/auth/signup')
      .send({
        name: "John Doe",
        email: "john@invalid", // Invalid email
        phoneNumber: "1234567890",
        accountNumber: "9876543210",
        password: "Password123!"
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid email format");
  });

  it("should return 400 if user already exists", async () => {
    // Mock that the user already exists in the database
    User.findOne.mockResolvedValueOnce({ email: "john@example.com" });

    const response = await request(app)
      .post('/api/auth/signup')
      .send({
        name: "John Doe",
        email: "john@example.com", // User already exists
        phoneNumber: "1234567890",
        accountNumber: "9876543210",
        password: "Password123!"
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("User with this email or phone number already exists");
  });

  it("should hash the password and create a new user successfully", async () => {
    // Mock the save method to avoid saving to the actual database
    User.prototype.save = jest.fn().mockResolvedValueOnce({});
    const response = await request(app)
      .post('/api/auth/signup')
      .send({
        name: "John Doe",
        email: "john@example.com",
        phoneNumber: "1234567890",
        accountNumber: "9876543210",
        password: "Password123!"
      });

    expect(response.status).toBe(201);

  });

  
//   it("should return 400 if the same email or account number is found", async () => {
//     // Mock the behavior where the user with same email/account number already exists
//     User.findOne.mockResolvedValueOnce({ email: "john@example.com", accountNumber: "9876543210" });

//     const response1 = await request(app)
//       .post('/api/auth/signup')
//       .send({
//         name: "John Doe",
//         email: "john@example.com",
//         phoneNumber: "12345678901",
//         accountNumber: "98765432101",
//         password: "Password1234!"
//       });
//     // Now try to sign up with the same account number (should be rejected)
//     const response = await request(app)
//       .post('/api/auth/signup')
//       .send({
//         name: "John Doe",
//         email: "john@example.com",
//         phoneNumber: "12345678901",
//         accountNumber: "9876543210", // Same account number as existing user
//         password: "Password1234!"
//       });

//     expect(response.status).toBe(400);
//     expect(response.body.message).toBe("User with this email or phone number already exists");
//   });

  



  
  

});
