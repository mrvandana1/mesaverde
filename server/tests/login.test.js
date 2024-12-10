const request = require('supertest');
const express = require('express');
const router = require('../routes/auth');  // Import your auth routes from the correct path
const User = require('../models/User');   // Import your User model
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
// Setup mock app
const app = express();
app.use(express.json());
app.use("/api/auth", router); // Use the auth routes for the /api/auth endpoint

// Mock database operations (optional, if you're not using a real DB in tests)
jest.mock('../models/User');  // Mock the User model
jest.mock('jsonwebtoken'); 
describe("POST /api/auth/login", () => {
  beforeAll(() => {
    mongoose.connect("mongodb+srv://vandanamohanaraj:Vandana1087@cluster0.w8m80jg.mongodb.net/se", { useNewUrlParser: true, useUnifiedTopology: true });
  });

  afterAll(() => {
    mongoose.connection.close();
  });

  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test to avoid interference
  });

  it("should return 400 if email format is invalid", async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: "john@invalid", // Invalid email
        password: "Password123!"
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid email format");
  });

  it("should return 400 if user does not exist", async () => {
    // Mock that the user does not exist
    User.findOne.mockResolvedValueOnce(null);

    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: "john@example.com", // User does not exist
        password: "Password123!"
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("User not found");
  });

  it("should return 400 if password is incorrect", async () => {
    const mockUser = { 
      email: "john@example.com", 
      password: await bcrypt.hash("Password123!", 10)  // Hashing the correct password
    };

    // Mock the user lookup and return a user with a different password
    User.findOne.mockResolvedValueOnce(mockUser);

    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: "john@example.com",
        password: "IncorrectPassword!"  // Wrong password
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid credentials");
  });

  it("should return 200 and a token if login is successful", async () => {
    const mockUser = { 
        email: "john@example.com", 
        password: await bcrypt.hash("Password123!", 10)  // Hashing the correct password
      };
  
      // Mock the user lookup and return a user with a different password
      User.findOne.mockResolvedValueOnce(mockUser);
      jwt.sign.mockReturnValueOnce("mocked_jwt_token");
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: "john@example.com",
          password: "Password123!"  // Wrong password
        });
  
      expect(response.status).toBe(200);

  });

  it("should return 500 if there is an internal server error", async () => {
    // Simulate an error during user lookup
    User.findOne.mockRejectedValueOnce(new Error("Database error"));

    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: "john@example.com",
        password: "Password123!"
      });

    expect(response.status).toBe(500);
    expect(response.body.message).toBe("Error logging in");
  });
});
