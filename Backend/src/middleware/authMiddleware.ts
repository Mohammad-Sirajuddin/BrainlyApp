/**
 * Authentication Middleware
 * 
 * This middleware protects routes by verifying JWT tokens.
 * It runs before protected route handlers to ensure user authentication.
 * 
 * How it works:
 * 1. Extracts JWT token from request headers
 * 2. Verifies token using JWT_SECRET
 * 3. Adds user ID to request object for use in route handlers
 * 4. Calls next() to continue to the actual route handler
 */

import type { Request,Response } from "express";
import jwt from "jsonwebtoken"
import type { Types } from "mongoose";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Security check: Ensure JWT_SECRET exists
// This prevents the middleware from running with insecure configurations
if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is required!");
}

const JWT_SECRET = process.env.JWT_SECRET;

/**
 * JWT Authentication Middleware Function
 * 
 * Protects routes by verifying JWT tokens from request headers.
 * 
 * @param req - Express request object (expects 'token' in headers)
 * @param res - Express response object
 * @param next - Express next function to continue to route handler
 */
function authMiddleware(req:Request,res:Response,next:Function){
    // Extract token from request headers
    // Frontend should send token in headers as: { token: "jwt_token_here" }
    const token = req.headers.token as string;

    // Check if token is provided
    if(!token){
        return res.status(401).json({
            message:"Token Missing"
        })
    }
    
    try {
        // Verify and decode the JWT token
        // This ensures the token is valid and hasn't been tampered with
        const data = jwt.verify(token,JWT_SECRET) as {id:Types.ObjectId};
        
        // Add user ID to request object for use in route handlers
        // This allows protected routes to know which user is making the request
        req.id = data.id
        
        // Continue to the actual route handler
        next();
    } catch (error) {
        // Token is invalid, expired, or malformed
        return res.status(401).json({
            message:"Invalid Token"
        })
    }
}

// Export middleware for use in route protection
export {authMiddleware}