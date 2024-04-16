"use client";
import React, { useState } from "react";
import PlayListItem from "@/components/Playlist";
import { PLAY_LIST_JSON } from "@/lib/constants";
import CustomVideoPlayer from "@/components/VideoPlayer";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";

export default function ParentPlayer() {
  // State variables
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [videos, setVideos] = useState(PLAY_LIST_JSON.categories[0].videos);
  const [isDragging, setIsDragging] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Filter videos based on search term
  const filteredVideos = videos.filter((video) =>
    video.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Drag and drop functions
  function handleOnDragStart() {
    setIsDragging(true);
  }

  function handleOnDragEnd(result) {
    setIsDragging(false);
    if (!result.destination) return;

    const items = Array.from(filteredVideos);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setVideos(items);

    const newIndex = items.findIndex(
      (item) => item === filteredVideos[currentVideoIndex]
    );

    setCurrentVideoIndex(newIndex);
  }

  // Video selection functions
  const selectVideo = (index) => {
    if (!isDragging) {
      setCurrentVideoIndex(parseInt(index)); // Parse index as integer
    }
  };

  // Navigation functions
  const handleNextVideo = () => {
    const nextIndex = (currentVideoIndex + 1) % filteredVideos.length;
    setCurrentVideoIndex(nextIndex);
  };

  const handlePreviousVideo = () => {
    const nextIndex =
      (currentVideoIndex - 1 + filteredVideos.length) % filteredVideos.length;
    setCurrentVideoIndex(nextIndex);
  };

  return (
    <div className="container mx-auto p-4 rounded-lg shadow-lg">
      {/* Header */}
      <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center text-black bg-white p-4 mx-auto rounded-lg">
        Pramodh's Video Player
      </h1>
      {/* Video Player and Playlist Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Video Player Section */}
        <div className="md:col-span-1">
          <div className="rounded-lg overflow-hidden">
            <CustomVideoPlayer
              src={filteredVideos[currentVideoIndex]?.sources}
              autoPlay={true}
              onNextVideo={handleNextVideo}
              onPreviousVideo={handlePreviousVideo}
              thumbnail={filteredVideos[currentVideoIndex]?.images}
            />
            {/* Video details */}
            <div className="bg-gray-800 bg-opacity-50 text-white py-5 px-6">
              <h2 className="text-2xl font-bold mb-2">
                {filteredVideos[currentVideoIndex]?.title}
              </h2>
              <p className="text-lg mb-2">
                {filteredVideos[currentVideoIndex]?.description}
              </p>
              <p className="text-base">
                {filteredVideos[currentVideoIndex]?.subtitle}
              </p>
            </div>
          </div>
        </div>
        {/* Playlist Section */}
        <div className="flex-1">
          <div className="bg-gray-900 rounded-lg p-4">
            {/* Search input */}
            <input
              type="text"
              placeholder="Search videos"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-800 text-white placeholder-gray-300 px-4 py-2 rounded-md mb-4 focus:outline-none focus:ring focus:border-blue-500"
            />
            {/* Drag and drop playlist */}
            <DragDropContext
              onDragStart={handleOnDragStart}
              onDragEnd={handleOnDragEnd}
            >
              <Droppable droppableId="video">
                {(provided) => (
                  <ul
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="playlist"
                  >
                    {/* Map through filtered videos */}
                    {filteredVideos.map((video, index) => (
                      <Draggable
                        key={index.toString()}
                        draggableId={index.toString()}
                        index={index}
                      >
                        {(provided) => (
                          <li
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            onClick={() => selectVideo(index.toString())}
                            className="cursor-pointer"
                          >
                            {/* Render playlist item */}
                            <PlayListItem
                              video={video}
                              index={index}
                              currentVideoIndex={currentVideoIndex}
                            />
                          </li>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </ul>
                )}
              </Droppable>
            </DragDropContext>
          </div>
        </div>
      </div>
    </div>
  );
}
