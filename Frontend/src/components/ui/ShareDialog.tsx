/**
 * Share Dialog Component
 * 
 * A modal dialog that displays shareable links for user collections.
 * Features:
 * - Elegant modal overlay with backdrop click to close
 * - Copy-to-clipboard functionality with visual feedback
 * - Themed design matching the application's purple-blue gradient
 * - Brain icon branding
 * - Success state with checkmark animation
 * 
 * Props:
 * - isOpen: Controls dialog visibility
 * - onClose: Callback to close the dialog
 * - shareLink: The generated shareable URL to display
 */

import { useState } from "react";
import { BrainIcon } from "../icons/BrainIcon";
import { CopyIcon } from "../icons/CopyIcon";
import { CheckedIcon } from "../icons/CheckedIcon";

interface ShareDialogProps {
  isOpen: boolean;
  onClose: () => void;
  shareLink: string;
}

export function ShareDialog({ isOpen, onClose, shareLink }: ShareDialogProps) {
  // State to track copy success for visual feedback
  const [copied, setCopied] = useState(false);

  /**
   * Handle copy to clipboard functionality
   * Uses the modern Clipboard API with fallback error handling
   */
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
      // Reset copied state after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  // Don't render if dialog is closed
  if (!isOpen) return null;

  /**
   * Handle backdrop clicks to close dialog
   * Only closes when clicking the backdrop, not the dialog content
   */
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    // Modal Backdrop - semi-transparent overlay
    <div
      className="fixed inset-0 bg-slate-800/60 flex items-center justify-center p-4 z-50"
      onClick={handleBackdropClick}
    >
      {/* Dialog Content */}
      <div className="bg-white rounded-2xl p-8 w-[480px] max-w-md shadow-2xl border border-slate-200">
        
        {/* Header Section with Brain Icon and Title */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <BrainIcon className="text-secondary w-12 h-12"/>
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Share Your Brain
              </h2>
              <p className="text-sm text-slate-500">Spread the knowledge</p>
            </div>
          </div>
          
          {/* Close Button */}
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-2xl font-bold w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors"
          >
            ×
          </button>
        </div>

        {/* Description Text */}
        <p className="text-slate-600 mb-6 text-center">
          Share this magical link to give others access to your brilliant
          collection of ideas! ✨
        </p>

        {/* Link Input with Copy Button */}
        <div className="relative mb-6">
          <div className="flex items-center border-2 border-slate-200 rounded-xl p-4 bg-gradient-to-r from-slate-50 to-white hover:border-purple-300 transition-colors">
            {/* Read-only input showing the shareable link */}
            <input
              type="text"
              value={shareLink}
              readOnly
              className="flex-1 bg-transparent outline-none text-sm text-slate-700 select-all font-mono"
              placeholder="Your shareable link will appear here..."
            />
            
            {/* Copy Button with State-based Icon */}
            <button
              onClick={handleCopy}
              className="ml-3 p-3 hover:bg-gradient-to-r hover:from-purple-600 hover:to-blue-600 bg-slate-100 rounded-lg transition-all duration-200 group"
              title="Copy link"
            >
              {copied ? (
                // Success state - show checkmark
                <div className="flex items-center gap-2">
                  <span className="text-green-600 text-lg font-bold">✓</span>
                  <span className="text-green-600 text-sm font-semibold">
                    <CheckedIcon size="lg" />
                  </span>
                </div>
              ) : (
                // Default state - show copy icon
                <CopyIcon
                  size="lg"
                  className="text-slate-600 group-hover:text-white transition-colors"
                />
              )}
            </button>
          </div>
        </div>

        {/* Success Message - only shown when link is copied */}
        {copied && (
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full border border-green-200">
              <span className="font-medium">Link copied to clipboard!</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
