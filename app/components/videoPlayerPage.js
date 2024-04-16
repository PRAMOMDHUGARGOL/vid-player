"use client";
import { useState } from "react";
import PlayList from "@/components/Playlist";
import { PLAY_LIST_JSON } from "@/lib/constants";
import CustomVideoPlayer from "@/components/VideoPlayer";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";

export default function VideoPlayerPage() {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [videos, setVideos] = useState(PLAY_LIST_JSON.categories[0].videos);
  const [isDragging, setIsDragging] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const filteredVideos = videos.filter((video) =>
    video.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  function handleOnDragStart() {
    setIsDragging(true);
  }

  const handleNextVideo = () => {
    const nextIndex = (currentVideoIndex + 1) % filteredVideos.length;
    setCurrentVideoIndex(nextIndex);
  };

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

  const selectVideo = (index) => {
    if (!isDragging) {
      // Find the index of the clicked video in the filteredVideos array
      const clickedVideoIndex = parseInt(index); // Ensure index is parsed as integer
      // Update the currentVideoIndex state with the clicked index
      setCurrentVideoIndex(clickedVideoIndex);
    }
  };

  return (
    <div className="container mx-auto p-4 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Pramodh's Video Player
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="md:col-span-1">
          {/* Video Player Section */}
          <div className="rounded-lg overflow-hidden">
            <CustomVideoPlayer
              src={filteredVideos[currentVideoIndex]?.sources}
              autoPlay={true}
              onNextVideo={handleNextVideo}
              thumbnail={filteredVideos[currentVideoIndex]?.images}
            />
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
        <div className="flex-1">
          {/* Playlist Section */}
          <div className="bg-gray-900 rounded-lg p-4">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
              Playlist
            </h2>
            <input
              type="text"
              placeholder="Search videos"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-800 text-white placeholder-gray-300 px-4 py-2 rounded-md mb-4 focus:outline-none focus:ring focus:border-blue-500"
            />
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
                            <PlayList
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
