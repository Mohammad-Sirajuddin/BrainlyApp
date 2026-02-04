/**
 * Home Page Component
 *
 * Main dashboard of the Second Brain application where users can:
 * - View all their saved content in a masonry layout
 * - Filter content by type (YouTube, Twitter, documents)
 * - Add new content via dialog
 * - Share their entire collection
 * - Logout from the application
 *
 * Features:
 * - Responsive masonry grid layout
 * - Real-time content filtering
 * - Twitter widget integration
 * - Custom alert system
 * - Shareable collection links
 */

import { Button } from "../components/ui/Buttons";
import { PlusIcon } from "../components/icons/PlusIcon";
import { ShareIcon } from "../components/icons/ShareIcon";
import { SideBar } from "../components/ui/Sidebar";
import { Card } from "../components/ui/Cards";
import { useMemo, useState, useEffect } from "react";
import { CreateContentDialog } from "../components/ui/CreateContentDialog";
import { ShareDialog } from "../components/ui/ShareDialog";
import { CustomAlert } from "../components/ui/CustomAlert";
import { useContent } from "../hooks/useContent";
import { useAlert } from "../hooks/useAlert";
import Masonry from "react-masonry-css";
import axios from "axios";
import { BackendURL } from "../config/config";
import { LogoutIcon } from "../components/icons/LogoutIcon";
import { useNavigate } from "react-router-dom";

export function Home() {
  // State management for UI components
  const [isOpen, setisOpen] = useState(false); // Controls add content dialog
  const [shareDialogOpen, setShareDialogOpen] = useState(false); // Controls share dialog
  const [shareLink, setShareLink] = useState(""); // Stores generated share link

  // Custom hooks for data and alerts
  const { contents, refetch } = useContent(); // Manages content data and refresh
  const { alert, showAlert, hideAlert } = useAlert(); // Custom alert system
  const navigate = useNavigate(); // For programmatic navigation

  // Filter state for sidebar functionality
  const [ActiveFilter, setActiveFilter] = useState("all");

  /**
   * Memoized content filtering
   *
   * Uses useMemo for performance optimization - only recalculates when
   * contents or ActiveFilter changes. This prevents unnecessary re-renders
   * when other state updates occur.
   */
  const filteredContents = useMemo(() => {
    if (ActiveFilter === "all") {
      return contents; // Show all content
    } else {
      // Filter content by selected type
      const filtered = contents.filter(
        (content: any) => content.types === ActiveFilter,
      );
      return filtered;
    }
  }, [contents, ActiveFilter]);

  /**
   * Twitter Widget Integration
   *
   * Dynamically loads Twitter's widget script and refreshes widgets
   * when filtered content changes. This ensures Twitter embeds render
   * properly after filtering operations.
   */
  useEffect(() => {
    // Load Twitter script if not already present
    if (!document.querySelector('script[src*="platform.twitter.com"]')) {
      const script = document.createElement("script");
      script.src = "https://platform.twitter.com/widgets.js";
      script.async = true;
      script.charset = "utf-8";
      document.head.appendChild(script);
    }

    // Refresh Twitter widgets after content changes
    const timer = setTimeout(() => {
      if ((window as any).twttr && (window as any).twttr.widgets) {
        (window as any).twttr.widgets.load();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [filteredContents]);

  /**
   * Handle sidebar filter changes
   * Updates the active filter state to show only content of selected type
   */
  const handleFilter = (filterState: string) => {
    setActiveFilter(filterState);
  };

  /**
   * Handle successful content addition
   * Closes the add content dialog and refreshes the content list
   */
  const handleContentAdded = () => {
    setisOpen(false);
    refetch(); // Refresh content from server
  };

  /**
   * Handle collection sharing
   * Generates a shareable link for the user's entire collection
   */
  const handleShareCollection = async () => {
    try {
      const response = await axios.post(
        `${BackendURL}/share`,
        {},
        {
          headers: {
            token: localStorage.getItem("token"), // Include auth token
          },
        },
      );

      setShareLink(response.data.shareableLink);
      setShareDialogOpen(true); // Open share dialog with generated link
    } catch (error: any) {
      console.error("Share error:", error);
      showAlert("Failed to generate shareable link", "error");
    }
  };

  /**
   * Handle user logout
   * Clears authentication token and redirects to signin page
   */
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/signin");
  };

  /**
   * Responsive breakpoints for masonry layout
   * Adjusts number of columns based on screen width
   */
  const breakpointColumns = {
    default: 4, // 4 columns on large screens
    1400: 3, // 3 columns on medium-large screens
    1100: 2, // 2 columns on medium screens
    700: 1, // 1 column on small screens
    500: 1, // 1 column on mobile
  };

  return (
    <div className="flex w-full min-h-screen overflow-x-hidden">
      {/* Fixed Sidebar - stays in place while content scrolls */}
      <div className="w-64 h-screen fixed left-0 top-0 z-20">
        <SideBar onFilterChange={handleFilter} />
      </div>

      {/* Main Content Area - offset by sidebar width */}
      <div className="flex-1 ml-64 max-w-full">
        {/* Sticky Header - remains visible while scrolling */}
        <div className="flex justify-between items-center p-6 sticky top-0 bg-gradient-to-r from-white to-slate-50 z-10 border-b border-slate-200 shadow-lg rounded-br-lg">
          <div className="font-serif text-4xl bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            All Notes
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2">
            {/* Share Collection Button */}
            <Button
              variant="primary"
              text="Share"
              size={"md"}
              className="shadow-md shadow-slate-300 cursor-pointer !rounded-full"
              onClick={handleShareCollection}
              startIcon={<ShareIcon size="lg" />}
            />

            {/* Add Content Button */}
            <Button
              variant="secondary"
              text="Add Content"
              size={"md"}
              className="shadow-md shadow-slate-300 cursor-pointer !rounded-full"
              onClick={() => {
                setisOpen(true);
              }}
              startIcon={<PlusIcon size="lg" />}
            />

            {/* Logout Button */}
            <Button
              variant="primary"
              text="Logout"
              size={"md"}
              className="shadow-md shadow-slate-300 cursor-pointer !rounded-full"
              onClick={handleLogout}
              startIcon={<LogoutIcon size="lg" />}
            />
          </div>
        </div>

        {/* Content Grid - Masonry layout for optimal space usage */}
        <div className="w-full p-4 overflow-x-hidden">
          <Masonry
            breakpointCols={breakpointColumns}
            className="flex w-full -ml-1"
            columnClassName="masonry-column pl-1"
          >
            {/* Render filtered content as cards */}
            {filteredContents.map(({ _id, types, link, title, tags }) => (
              <Card
                id={_id}
                key={_id}
                title={title}
                contentType={types}
                link={link}
                tags={tags}
                onSuccessDelete={refetch} // Refresh content after deletion
                showAlert={showAlert} // Pass alert function to card
              />
            ))}
          </Masonry>
        </div>
      </div>

      {/* Modal Dialogs */}
      {/* Add Content Dialog */}
      <CreateContentDialog
        isOpen={isOpen}
        onClose={() => setisOpen(false)}
        onContentAdded={handleContentAdded}
        showAlert={showAlert}
      />

      {/* Share Collection Dialog */}
      <ShareDialog
        isOpen={shareDialogOpen}
        onClose={() => setShareDialogOpen(false)}
        shareLink={shareLink}
      />

      {/* Custom Alert Component */}
      <CustomAlert
        message={alert.message}
        type={alert.type}
        isVisible={alert.isVisible}
        onClose={hideAlert}
      />
    </div>
  );
}
