"use client";
import React, { useState } from "react";
import PlayList from "@/components/Playlist";
import { PLAY_LIST_JSON } from "@/lib/constants";
import CustomVideoPlayer from "@/components/VideoPlayer";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";

export default function VideoPlayerPage() {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [videos, setVideos] = useState(PLAY_LIST_JSON.categories[0].videos);
  const [isDragging, setIsDragging] = useState(false);

  function handleOnDragStart() {
    setIsDragging(true);
  }

  const handleNextVideo = () => {
    if (currentVideoIndex < videos.length - 1) {
      setCurrentVideoIndex((prevIndex) => prevIndex + 1);
    } else {
      setCurrentVideoIndex(0);
    }
  };

  function handleOnDragEnd(result) {
    setIsDragging(false);
    if (!result.destination) return;

    const items = Array.from(videos);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setVideos(items);

    // Find the index of the current video after reordering
    const newIndex = items.findIndex(
      (item) => item === videos[currentVideoIndex]
    );

    // Update the currentVideoIndex state with the new index
    setCurrentVideoIndex(newIndex);
  }

  const selectVideo = (index) => {
    if (!isDragging) {
      setCurrentVideoIndex(index);
    }
  };

  return (
    <div className="container mx-auto p-5 md:px-0">
      <h1 className="text-3xl font-bold mb-1">Pramodh's Video Player</h1>
      <p className="text-lg text-gray-400 mb-8">
        Enjoy watching your favorite videos!
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:order-1">
          <CustomVideoPlayer
            src={videos[currentVideoIndex]?.sources}
            autoPlay={true}
            onNextVideo={handleNextVideo}
            thumbnail={videos[currentVideoIndex]?.images}
          />
          <div className=" bg-black bg-opacity-50 text-white py-5 mb-5 mx-auto">
            <h2 className="text-2xl font-bold mb-2">
              {videos[currentVideoIndex]?.title}
            </h2>
            <p className="text-lg mb-2">
              {videos[currentVideoIndex]?.description}
            </p>
            <p className="text-base">{videos[currentVideoIndex]?.subtitle}</p>
          </div>
        </div>

        <div className="md:order-2">
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
                  {videos.map((video, index) => (
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
  );
}
