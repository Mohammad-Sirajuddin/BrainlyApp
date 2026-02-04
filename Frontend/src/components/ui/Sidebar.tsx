/**
 * Sidebar Component
 * 
 * Navigation sidebar for the Second Brain application.
 * Features:
 * - Branded header with brain icon and app name
 * - Filter buttons for different content types
 * - Gradient styling matching the app theme
 * - Fixed positioning for persistent navigation
 * 
 * Content Filters:
 * - YouTube videos
 * - Twitter posts  
 * - Documents
 * - Links (placeholder)
 * - Tags (placeholder)
 */

import { BrainIcon } from "../icons/BrainIcon";
import { DocumentsIcon } from "../icons/DocumentsIcon";
import { LinksIcon } from "../icons/LinksIcon";
import { TagsIcon } from "../icons/TagsIcon";
import { TwitterIcon } from "../icons/TwitterIcon";
import { YoutubeIcon } from "../icons/YoutubeIcon";
import { SideBarItems } from "./SidebarItems";

// Props interface for sidebar component
interface SideBarProps {
  onFilterChange: (filterState: string) => void;  // Callback for filter changes
}

export const SideBar = ({ onFilterChange }: SideBarProps) => {
  return (
    <div className="w-64 min-w-64 h-full border-r border-slate-200 shadow-sm rounded-br-lg flex-shrink-0 bg-gradient-to-b from-slate-50 to-white">
      
      {/* Header Section - App Branding */}
      <div className="flex items-center p-4 border-b border-slate-100">
        <BrainIcon className="text-secondary w-12 h-12" />
        <p className="text-2xl font-bold tracking-tight font-serif bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent ml-2">
          Second Brain
        </p>
      </div>
      
      {/* Navigation Items - Content Type Filters */}
      <div className="p-2 space-y-3">
        {/* YouTube Filter */}
        <SideBarItems 
          icon={<YoutubeIcon />} 
          text={"Youtube"} 
          OnClick={() => onFilterChange("youtube")} 
        />
        
        {/* Twitter Filter */}
        <SideBarItems 
          icon={<TwitterIcon/>} 
          text="Twitter" 
          OnClick={() => onFilterChange("Twitter")}
        />
        
        {/* Documents Filter */}
        <SideBarItems 
          icon={<DocumentsIcon/>} 
          text="Documents" 
          OnClick={() => onFilterChange("document")}
        />
        
        {/* Placeholder Items - Not yet implemented */}
        <SideBarItems icon={<LinksIcon/>} text="Links"/>
        <SideBarItems icon={<TagsIcon/>} text="Tags"/>
      </div>
    </div>
  );
};
