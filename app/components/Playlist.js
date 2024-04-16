import React from "react"; // Import React

// Import FontAwesome Play icon
import { FaPlay } from "react-icons/fa";

// Define Playlist component
const PlayListItem = ({ video, currentVideoIndex, index }) => {
  // Determine if the playlist item is active
  const isActive = index === parseInt(currentVideoIndex);

  // Return the playlist item component
  return (
    <div
      // Apply dynamic classes based on isActive state
      className={`relative flex items-center mb-4 gap-4 cursor-pointer rounded-lg transition-all duration-300 ${
        isActive ? "bg-gray-700 shadow-md" : ""
      } ${!isActive && "hover:md:bg-gray-700"}`}
      style={{ width: "100%" }} // Set a fixed width for each playlist item
    >
      {/* Thumbnail */}
      <div className="h-20 w-32 rounded-lg overflow-hidden flex-shrink-0">
        <img
          className="w-full h-full object-cover"
          src={video.images}
          alt={video.title} // Set alt attribute for accessibility
        />
      </div>
      {/* Content */}
      <div className="flex flex-col flex-grow ml-3">
        <h3
          className="text-lg font-semibold text-white mb-1"
          style={{ maxWidth: "200px" }} // Set max width for the title
          title={video.title} // Set title attribute for tooltip
        >
          {video.title}
        </h3>
        <p className="text-sm text-gray-300">{video.subtitle}</p>
      </div>
      {/* Play icon */}
      {isActive && (
        <div className="flex justify-center items-center h-5 md:w-10 md:h-10 md:rounded-full md:bg-blue-500 text-white mr-4">
          <FaPlay />
        </div>
      )}
    </div>
  );
};

export default PlayListItem; // Export Playlist component
