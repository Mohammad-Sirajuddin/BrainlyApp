/**
 * Content Controller
 * 
 * Handles all content-related operations for the Second Brain application:
 * - Adding new content (YouTube, Twitter, documents)
 * - Retrieving user's content
 * - Deleting content
 * - Sharing collections via shareable links
 * - Accessing shared collections
 */

import { ContentModel, UserModel } from "../db/user.schema.js";
import { contentSchemaZod } from "../models/user.model.js";
import { type Request, type Response } from "express";
import crypto from "crypto";

/**
 * Add New Content Handler
 * 
 * Allows authenticated users to add new content to their collection.
 * Supports YouTube videos, Twitter posts, and documents.
 * 
 * @param req - Express request object containing content data
 * @param res - Express response object
 */
async function addContent(req: Request, res: Response) {
  // Validate request body against content schema
  // Ensures all required fields are present and properly formatted
  const result = contentSchemaZod.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      error: result.error,
    });
  }

  // Check if user is authenticated (middleware adds req.id)
  if (!req.id) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const { types, link, title, tags } = result.data;
    
    // Create new content entry linked to the authenticated user
    await ContentModel.create({
      types: types,        // Content type: "youtube", "Twitter", or "document"
      link: link,          // URL to the content
      title: title,        // User-provided title
      tags: tags,          // Tags for organization
      UserId: req.id,      // Link content to the authenticated user
    });
    
    res.status(201).json({ message: "Content Added Successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Server Error!" });
  }
}

/**
 * Get All User Content Handler
 * 
 * Retrieves all content belonging to the authenticated user.
 * Used to populate the main dashboard/home page.
 * 
 * @param req - Express request object (user ID from auth middleware)
 * @param res - Express response object
 */
async function getAllContent(req: Request, res: Response) {
  // Check if user is authenticated
  if (!req.id) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  
  try {
    // Find all content entries belonging to this user
    const user = await ContentModel.find({ UserId: req.id });
    return res.status(200).json({ user });
  } catch (error) {
    return res.status(404).json({ message: "User not Found!" });
  }
}

/**
 * Delete Content Handler
 * 
 * Allows users to delete specific content items from their collection.
 * 
 * @param req - Express request object (content ID in params)
 * @param res - Express response object
 */
async function deleteContent(req: Request, res: Response) {
  // Extract content ID from URL parameters
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: "id must be provided!" });
  }

  try {
    // Check if content exists before attempting deletion
    const foundContent = await ContentModel.findOne({ _id: id });
    console.log(foundContent);
    
    if (!foundContent) {
      return res.status(404).json({ message: "Content Doesn't exist!" });
    } else {
      // Delete the content from database
      await ContentModel.deleteOne({ _id: id });
      return res.status(200).json({ message: "Deleted Successfully!" });
    }
  } catch (err) {
    res.status(500).json({ message: "server Error" });
  }
}

/**
 * Share Collection Handler
 * 
 * Generates a shareable link for a user's entire content collection.
 * Creates a unique token that allows public access without authentication.
 * 
 * @param req - Express request object (user ID from auth middleware)
 * @param res - Express response object
 */
async function shareContent(req: Request, res: Response) {
  // Check if user is authenticated
  if (!req.id) {
    return res.status(400).json({ message: "Unauthorised!" });
  }

  try {
    // Generate a unique, secure token for sharing
    // crypto.randomUUID() creates a cryptographically secure random UUID
    const shareToken = crypto.randomUUID();
    
    // Update user record with the new share token
    await UserModel.updateOne({ _id: req.id }, { shareToken: shareToken });

    // Create the shareable URL
    // Note: In production, this should use the actual domain
    const ShareableLink = `http://localhost:5173/shared/${shareToken}`;
    
    return res.status(200).json({
      message: "Shareable Link Generated Successfully!",
      shareableLink: ShareableLink,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server Error!" });
  }
}

/**
 * Get Shared Content Handler
 * 
 * Retrieves content for public viewing via shareable links.
 * No authentication required - anyone with the link can view.
 * 
 * @param req - Express request object (shareToken in params)
 * @param res - Express response object
 */
async function getSharedContent(req: Request, res: Response) {
  // Extract share token from URL parameters
  const { shareToken } = req.params;

  if (!shareToken) {
    return res.status(400).json({ message: "ShareToken is Required!" });
  }

  try {
    // Find user by their share token
    const user = await UserModel.findOne({ shareToken: shareToken });
    if (!user) {
      return res.status(404).json({ message: "Content Not Found!" });
    }

    // Get all content belonging to the user who shared the collection
    const userContent = await ContentModel.find({ UserId: user._id });
    
    // Return content along with owner's name for display
    return res
      .status(200)
      .json({ contents: userContent, ownerName: user.username });
  } catch (error) {
    return res.status(500).json({ message: "Server Error!" });
  }
}

// Export all content-related functions for use in routes
export {
  addContent,
  getAllContent,
  deleteContent,
  shareContent,
  getSharedContent,
};
