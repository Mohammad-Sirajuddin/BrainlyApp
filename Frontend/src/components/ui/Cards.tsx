/**
 * Card Component and Related Utilities
 * 
 * This file contains the main Card component for displaying content items,
 * along with supporting functions and components for:
 * - Content rendering (YouTube, Twitter, Documents)
 * - Delete functionality
 * - Share functionality
 * - Media type icons
 * 
 * The Card component is used in both authenticated (Home) and public (SharedCollection) views.
 */

import type { ReactElement } from "react";
import { ShareIcon } from "../icons/ShareIcon";
import { DocumentsIcon } from "../icons/DocumentsIcon";
import { DeleteIcon } from "../icons/DeleteIcon";
import { YoutubeIcon } from "../icons/YoutubeIcon";
import { TwitterIcon } from "../icons/TwitterIcon";
import { TagsIcon } from "../icons/TagsIcon";
import { useEffect } from "react";
import axios from "axios";
import { BackendURL } from "../../config/config";

// Type definitions for Card component props and content types
export interface CardProps {
  title: string;
  contentType: "Twitter" | "youtube" | "document";
  link: string;
  tags: ReactElement;
  time?: string;
  id: string;
  onSuccessDelete: () => void;
  showAlert?: (message: string, type: 'success' | 'error' | 'info') => void;
  readOnly?: boolean;  // Disables delete functionality for shared views
}

export type CardContent =
  | { type: "youtube"; url: string }
  | { type: "document"; url: string }
  | { type: "Twitter"; url: string };

export type MediaIconType =
  | { type: "youtube"; className: string }
  | { type: "document"; className: string }
  | { type: "Twitter"; className: string };

/**
 * Handle Content Deletion
 * 
 * Sends DELETE request to backend and handles success/error states.
 * Provides user feedback through alerts and refreshes content list.
 * 
 * @param id - Content ID to delete
 * @param onSuccessDelete - Callback to refresh content list
 * @param showAlert - Optional custom alert function
 */
export async function handleDelete(
  id: string, 
  onSuccessDelete: () => void,
  showAlert?: (message: string, type: 'success' | 'error' | 'info') => void
) {
  try {
    const response = await axios.delete(`${BackendURL}/content/${id}`, {
      headers: {
        token: localStorage.getItem("token"),  // Include auth token
      },
    });
    
    console.log(response.data);
    onSuccessDelete();  // Refresh the content list
    
    // Show success message using custom alert or browser alert
    if (showAlert) {
      showAlert(response.data.message, 'success');
    } else {
      alert(response.data.message);
    }
  } catch (error: any) {
    console.log(error);

    // Extract error message from response
    const errorMessage =
      error.response?.data?.message ||
      error.response?.data ||
      error.message ||
      "Failed to delete content. Please try again.";

    // Show error message
    if (showAlert) {
      showAlert(errorMessage, 'error');
    } else {
      alert(errorMessage);
    }
  }
}

/**
 * Media Icon Renderer
 * 
 * Renders appropriate icon based on content type.
 * Used in card headers to visually identify content type.
 */
export function MediaIconRenderer({ IconType }: { IconType: MediaIconType }) {
  if (!IconType) return null;

  switch (IconType.type) {
    case "youtube":
      return <YoutubeIcon className={IconType.className} />;
    case "Twitter":
      return <TwitterIcon />;
    case "document":
      return <DocumentsIcon className={IconType.className} />;
    default:
      return null;
  }
}

/**
 * Card Media Content Renderer
 * 
 * Renders the main content preview based on content type.
 * Handles YouTube embeds, Twitter posts, and document links.
 */
function CardMediaRenderer({ content }: { content?: CardContent }) {
  if (!content) return null;

  switch (content.type) {
    case "youtube":
      return <YouTubePreview url={content.url} />;
    case "Twitter":
      return <TwitterPreview url={content.url} />;
    case "document":
      return <DocumentPreview url={content.url} />;
    default:
      return null;
  }
}

/**
 * YouTube URL Converter
 * 
 * Converts YouTube watch URLs to embed URLs for iframe embedding.
 * Example: youtube.com/watch?v=ABC123 → youtube.com/embed/ABC123
 */
function YtUrlExtrator(link: string): string {
  return link.replace("watch", "embed").replace("?v=", "/");
}

/**
 * YouTube Preview Component
 * 
 * Renders YouTube videos as embedded iframes.
 * Automatically converts watch URLs to embed format.
 */
export function YouTubePreview({ url }: { url: string }) {
  return (
    <iframe
      width="250"
      height="250"
      src={YtUrlExtrator(url)}
      className="rounded-3xl"
      title="YouTube video player"
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      referrerPolicy="strict-origin-when-cross-origin"
      allowFullScreen
    ></iframe>
  );
}

/**
 * Twitter Preview Component
 * 
 * Renders Twitter posts using Twitter's official embed widgets.
 * Dynamically loads Twitter's widget script and handles widget refresh.
 * 
 * Note: Converts x.com URLs back to twitter.com for compatibility.
 */
export function TwitterPreview({ url }: { url: string }) {
  useEffect(() => {
    // Load Twitter widget script if not already loaded
    if (!document.querySelector('script[src*="platform.twitter.com"]')) {
      const script = document.createElement('script');
      script.src = 'https://platform.twitter.com/widgets.js';
      script.async = true;
      script.charset = 'utf-8';
      document.head.appendChild(script);
    }

    // Trigger Twitter widget loading after script loads
    const timer = setTimeout(() => {
      if ((window as any).twttr && (window as any).twttr.widgets) {
        (window as any).twttr.widgets.load();
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <blockquote className="twitter-tweet">
      <a href={url.replace("x.com", "twitter.com")}></a>
    </blockquote>
  );
}

/**
 * Document Preview Component
 * 
 * Renders document links with both a clickable link and iframe preview.
 * Suitable for PDFs, web pages, and other document types.
 */
export function DocumentPreview({ url }: { url: string }) {
  return (
    <>
      <a href={url} className="underline text-blue-500">
        Go to document
      </a>
      <iframe src={url} frameBorder="0"></iframe>
    </>
  );
}

/**
 * Handle Individual Card Sharing
 * 
 * Copies the original content link to clipboard (not the shareable collection link).
 * This allows users to share individual pieces of content.
 * 
 * @param link - The original content URL to share
 * @param showAlert - Optional custom alert function
 */
async function handleShareOfCard(
  link: string,
  showAlert?: (message: string, type: 'success' | 'error' | 'info') => void
) {
  try {
    await navigator.clipboard.writeText(link);
    if (showAlert) {
      showAlert("Link copied to clipboard", 'success');
    } else {
      alert("Link copied to clipboard");
    }
  } catch (error) {
    console.log(error, "Failed to share link");
    if (showAlert) {
      showAlert("Failed to copy link", 'error');
    } else {
      alert("Failed to copy link");
    }
  }
}

/**
 * Main Card Component
 * 
 * Displays individual content items with:
 * - Content type icon and title
 * - Share and delete actions (delete disabled in read-only mode)
 * - Media preview (YouTube, Twitter, or document)
 * - Tags display
 * - Responsive design with hover effects
 */
export function Card(props: CardProps) {
  return (
    <div className="w-fit h-fit border-slate-200 border shadow-md rounded-2xl flex-col p-3 m-3">
      
      {/* Card Header - Title and Action Buttons */}
      <div className="flex">
        {/* Left side - Icon and Title */}
        <div className="flex flex-1 items-center">
          {MediaIconRenderer({
            IconType: { type: props.contentType, className: "size-7 m-1 p-1" },
          })}
          <p className="flex flex-1 font-bold font-serif leading-4 ml-2">
            {props.title}
          </p>
        </div>
        
        {/* Right side - Action Buttons */}
        <div className="flex flex-end items-center">
          {/* Share Button - copies original content link */}
          <ShareIcon
            size="lg"
            className="size-7 hover:rounded-full cursor-pointer hover:bg-slate-200 m-1 p-1"
            onClick={() => {handleShareOfCard(props.link, props.showAlert)}}
          />
          
          {/* Delete Button - only shown in non-read-only mode */}
          {!props.readOnly && (
            <DeleteIcon
              onClick={() => {
                handleDelete(props.id, props.onSuccessDelete, props.showAlert);
              }}
              className="size-7 hover:rounded-full hover:bg-slate-200 p-1 m-1 cursor-pointer"
            />
          )}
        </div>
      </div>
      
      {/* Media Content Preview */}
      <div className="mb-2">
        {CardMediaRenderer({
          content: { type: props.contentType, url: props.link },
        })}
      </div>
      
      {/* Tags Section */}
      <div className="flex items-center mb-1">
        <div className="mr-1">
          <TagsIcon />
        </div>
        <div>{props.tags}</div>
      </div>
      
      {/* Optional Time Display */}
      <div className="mb-1">{props.time}</div>
    </div>
  );
}
