/**
 * Authentication Controller
 * 
 * This file handles user authentication operations including:
 * - User registration (signup)
 * - User login (signin)
 * - JWT token generation
 * - MongoDB connection setup
 */

import { userSchemaZod } from "../models/user.model.js";
import type { Request, Response } from "express";
import mongoose from "mongoose";
import { UserModel } from "../db/user.schema.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Security check: Ensure JWT_SECRET exists in environment variables
// This prevents the app from running with insecure default secrets
if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is required!");
}

// Store JWT secret for token signing/verification
const JWT_SECRET = process.env.JWT_SECRET;

// Build MongoDB connection string from environment variables
// This keeps sensitive credentials out of the source code
const MONGODB_URI = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_CLUSTER}/${process.env.MONGODB_DATABASE}?retryWrites=true&w=majority`;

// Establish MongoDB connection
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected successfully in authController");
    console.log("Connected to database:", process.env.MONGODB_DATABASE);
  })
  .catch((error) => {
    console.error("MongoDB connection failed in authController:", error);
  });

/**
 * User Registration Handler
 * 
 * Processes new user signup requests with the following steps:
 * 1. Validates input data using Zod schema (password requirements, etc.)
 * 2. Creates new user in MongoDB
 * 3. Handles duplicate username errors
 * 
 * @param req - Express request object containing username and password
 * @param res - Express response object
 */
async function signup(req: Request, res: Response) {
  // Validate request body against user schema
  // This ensures password meets security requirements (8-20 chars, uppercase, lowercase, special char, number)
  const result = userSchemaZod.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      message:
        "Password should be 8 to 20 letters, should have atleast one uppercase, one lowercase, one special character, one number",
      errors: result.error,
    });
  } else {
    try {
      const { username, password } = result.data;
      
      // Create new user in database
      await UserModel.create({
        username: username,
        password: password,
      });
      
      res.status(201).json({ messsage: "You are Signed Up!" });
    } catch (err: any) {
      console.error("Signup error:", err);

      // Handle MongoDB duplicate key error (username already exists)
      if (err.code === 11000) {
        res.status(500).json({ message: "User Already Exist" });
      } else {
        res.status(500).json({
          message: "Database connection error",
          error: err.message || "Unknown error",
        });
      }
    }
  }
}

/**
 * User Login Handler
 * 
 * Authenticates existing users and generates JWT tokens:
 * 1. Validates input credentials
 * 2. Checks if user exists in database
 * 3. Generates JWT token for authenticated sessions
 * 
 * @param req - Express request object containing username and password
 * @param res - Express response object
 */
async function signin(req: Request, res: Response) {
  // Validate request body against user schema
  const result = userSchemaZod.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({
      errors: result.error,
      message: "Enter Correct Username & password",
    });
  } else {
    try {
      const { username, password } = req.body;
      
      // Find user with matching credentials
      // Note: In production, passwords should be hashed and compared securely
      const userExist = await UserModel.findOne({
        username: username,
        password: password,
      });

      if (userExist) {
        // Generate JWT token containing user ID
        // This token will be used for authenticating future requests
        const token = jwt.sign(
          {
            id: userExist._id,
          },
          JWT_SECRET, // Use environment variable for security
        );
        
        res.json({ message: "You are Signed In!", token: token });
      } else {
        res.status(403).json({
          message: "Invalid Credentials",
        });
      }
    } catch (err) {
      console.log(err);
    }
  }
}

// Export authentication functions for use in routes
export { signup, signin };
